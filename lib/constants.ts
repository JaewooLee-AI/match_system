export const REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "기타"] as const;
export const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"] as const;

export type Region = (typeof REGIONS)[number];
export type JobType = (typeof JOB_TYPES)[number];
