export type SchoolRegisterationStatus =
  | 'Enrolled'
  | 'LeaveOfAbsence'
  | 'MilitaryLeaveOfAbsence'
  | 'Graduated'
  | 'Expelled'
export type MemberType =
  | 'AssociateMember'
  | 'RegularMember'
  | 'HonoraryMember'
  | 'Removed'
  | 'Explusion'

export const SchoolRegisterationStatusDescription: {
  [key in SchoolRegisterationStatus]: string
} = {
  Enrolled: '재학',
  Expelled: '제적',
  Graduated: '졸업',
  LeaveOfAbsence: '휴학',
  MilitaryLeaveOfAbsence: '군휴학',
}

export const MemberTypeDescription: {
  [key in MemberType]: string
} = {
  AssociateMember: '준회원',
  Explusion: '제명',
  HonoraryMember: '명예회원',
  RegularMember: '정회원',
  Removed: '제적',
}
