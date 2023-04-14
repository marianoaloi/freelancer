#!/bin/bash

#ssh kube '/home/maloi/Docker/recent/recent.sh '
copy(){
        npm run build
        ssh kube 'rm -r /data/freelancer/ && mkdir -p /data/freelancer/'
        scp -r /opt/maloi/angular/freelancer/dist/freelancer kube:"/data"
        scp -r /opt/maloi/angular/freelancer/*.conf kube:"/data/freelancer/"
        scp -r /opt/maloi/angular/freelancer/*.yaml kube:"/data/freelancer/"
        scp -r /opt/maloi/angular/freelancer/Dockerfile kube:"/data/freelancer/"

}

compile(){
        copy
        # ssh kube 'cd /data/freelancer && sudo rm -rf node_modules '
        # ssh kube 'cd /data/freelancer && npm i deasync '
        # ssh kube 'cd /data/freelancer && npm install --production '
        ssh kube 'cd /data/freelancer && docker build --pull --rm -f Dockerfile -t freelancer:latest . && docker tag freelancer localhost:5000/freelancer && docker push localhost:5000/freelancer'
        # ssh kube 'kubectl create secret generic -n freelancer-ns mongo-external-secret --from-literal=mongoexternal="'$MONGO_ARC'"'
}
case $1 in
    compile)
        ssh kube 'kubectl delete -f /data/freelancer/freelancer.yaml'
        ssh kube $'docker images | grep \'freelancer \' | awk \'{print $3}\' | xargs docker rmi -f'
        compile
       # ssh kube 'kubectl rollout restart deployment freelancer -n freelancer-ns'
        ssh kube 'kubectl apply -f /data/freelancer/freelancer.yaml'
        date +"%d-%m-%y %H:%M:%S"
    ;;
    copy)
        copy
        ssh kube 'kubectl rollout restart deployment freelancer -n freelancer-ns'
        date +"%d-%m-%y %H:%M:%S"
        git status
    ;;
    restart)
        ssh kube 'kubectl rollout restart deployment freelancer -n freelancer-ns'
        date +"%d-%m-%y %H:%M:%S"
    ;;
    batch)
       ssh kube "ID=$(docker ps |grep freelancers |awk '{print $1}') && echo 'Found Container ID: ${ID}' &&docker exec -ti $ID  /bin/bash"
    ;;
    *)
        printf "Use: \n \t copy\n \t compile\n \t restart\n \t batch\n\n"
        ;;
esac