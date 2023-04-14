export interface Bid {
    _id: number
    amount: number
    bidder_id: number
    description: string
    frontend_bid_status: string
    highlighted: boolean
    id: number
    is_location_tracked: boolean
    milestone_percentage: number
    period: number
    project_id: number
    project_owner_id: number
    retracted: boolean
    score: number
    sealed: boolean
    submitdate: number
    time_submitted: number
}