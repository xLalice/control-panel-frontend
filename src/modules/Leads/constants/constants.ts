

export const  LeadStatus = {
  New: "New",
  Contacted: "Contacted",
  Qualified: "Qualified",
  ProposalSent: "ProposalSent",
  Negotiation: "Negotiation",
  Won: "Won",
  Lost: "Lost",
} as const;

export enum LeadSource {
  WEBSITE = "Website",
  REFERRAL = "Referral",
  COLD_CALL = "Cold Call",
  SOCIAL_MEDIA = "Social Media",
  EMAIL_CAMPAIGN = "Email Campaign",
  EVENT = "Event",
  PARTNER = "Partner",
  ADVERTISEMENT = "Advertisement",
  OTHER = "Other"
}

export const PAGE_SIZE = 20;

