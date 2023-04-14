import { Bid } from "./Bid"

export interface Project {

    bids: Bid[]
    _id: number
    id: number
    owner_id: number
    title: string
    status: string
    seo_url: string
    currency: Currency
    description: string
    jobs: Job[]
    submitdate: number
    preview_description: string
    deleted: boolean
    nonpublic: boolean
    hidebids: boolean
    type: string
    bidperiod: number
    budget: Budget
    featured: boolean
    urgent: boolean
    bid_stats: BidStats
    time_submitted: number
    time_updated: number
    upgrades: Upgrades
    language: string
    hireme: boolean
    frontend_project_status: string
    location: Location
    local: boolean
    negotiated: boolean
    time_free_bids_expire: number
    pool_ids: string[]
    enterprise_ids: number[]
    is_escrow_project: boolean
    is_seller_kyc_required: boolean
    is_buyer_kyc_required: boolean
    project_reject_reason: ProjectRejectReason
    hourly_project_info?: HourlyProjectInfo
    enterprise_metadata_values?: any[]
    ignore: Date
    follow: Date
}

export interface Currency {
    id: number
    code: string
    sign: string
    name: string
    exchange_rate: number
    country: string
    is_external: boolean
    is_escrowcom_supported: boolean
}

export interface Job {
    id: number
    name: string
    category: Category
    seo_url: string
    local: boolean
}

export interface Category {
    id: number
    name: string
}

export interface Budget {
    minimum: number
    maximum?: number
}

export interface BidStats {
    bid_count: number
    bid_avg?: number
}

export interface Upgrades {
    featured: boolean
    sealed: boolean
    nonpublic: boolean
    fulltime: boolean
    urgent: boolean
    qualified: boolean
    NDA: boolean
    ip_contract: boolean
    non_compete: boolean
    project_management: boolean
    pf_only: boolean
    premium: boolean
    enterprise: boolean
}

export interface Location {
    country: Country
}

export interface Country { }

export interface ProjectRejectReason {
    description?: string
    message?: string
}

export interface HourlyProjectInfo {
    commitment: Commitment
    duration_enum: string
}

export interface Commitment {
    hours: number
    interval: string
}