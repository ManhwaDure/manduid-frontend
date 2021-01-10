import { getAccessorType } from 'typed-vuex'
import { GetterTree, MutationTree } from 'vuex'

export const state = () => ({
  rightCardLayout: {
    title: '만화두레',
    wide: false,
    error: false,
    token: localStorage?.getItem('auth_token'),
  },
})

export const getters: GetterTree<RootState, RootState> = {
  rightCardTitle: (state) => state.rightCardLayout.title,
  isErrorRightCard: (state) => state.rightCardLayout.error,
  isWideRightCard: (state) => state.rightCardLayout.wide,
}

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_RIGHT_CARD_LAYOUT_TITLE(state: any, title: string) {
    state.rightCardLayout.title = title
  },
  TOGGLE_ERROR_RIGHT_CARD_LAYOUT(state: any, toggled: boolean) {
    state.rightCardLayout.wide = toggled
  },
  TOGGLE_WIDE_RIGHT_CARD_LAYOUT(state: any, toggled: boolean) {
    state.rightCardLayout.error = toggled
  },
}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
})
