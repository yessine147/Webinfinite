// src/app/GiftCardlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  GiftCardlistState } from './giftCard.reducer';

export const selectDataState = createFeatureSelector<GiftCardlistState>('GiftCardList');

export const selectDataGiftCard = createSelector(
  selectDataState,
  (state: GiftCardlistState) => state?.GiftCardListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: GiftCardlistState) => state?.totalItems || 0
);
export const selectGiftCardById = (GiftCardId: string) =>createSelector(
  selectDataState,
  (state: GiftCardlistState) =>  state?.GiftCardListdata.find(GiftCard => GiftCard.id === +GiftCardId)
  );

export const selectDataLoading = createSelector(
  selectDataState,
  (state: GiftCardlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: GiftCardlistState) => state?.error || null
);
