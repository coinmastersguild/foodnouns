import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
    lastAuctionFoodNounId: number | undefined;
    onDisplayAuctionFoodNounId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
    lastAuctionFoodNounId: undefined,
    onDisplayAuctionFoodNounId: undefined,
};

const onDisplayFoodNounAuction = createSlice({
    name: 'onDisplayFoodNounAuction',
    initialState: initialState,
    reducers: {
        setLastAuctionFoodNounId: (state, action: PayloadAction<number>) => {
            state.lastAuctionFoodNounId = action.payload;
        },
        setOnDisplayAuctionFoodNounId: (state, action: PayloadAction<number>) => {
            state.onDisplayAuctionFoodNounId = action.payload;
        },
        setPrevOnDisplayAuctionFoodNounId: state => {
            if (!state.onDisplayAuctionFoodNounId) return;
            if (state.onDisplayAuctionFoodNounId === 0) return;
            state.onDisplayAuctionFoodNounId = state.onDisplayAuctionFoodNounId - 1;
        },
        setNextOnDisplayAuctionFoodNounId: state => {
            if (state.onDisplayAuctionFoodNounId === undefined) return;
            if (state.lastAuctionFoodNounId === state.onDisplayAuctionFoodNounId) return;
            state.onDisplayAuctionFoodNounId = state.onDisplayAuctionFoodNounId + 1;
        },
    },
});

export const {
    setLastAuctionFoodNounId,
    setOnDisplayAuctionFoodNounId,
    setPrevOnDisplayAuctionFoodNounId,
    setNextOnDisplayAuctionFoodNounId,
} = onDisplayFoodNounAuction.actions;

export default onDisplayFoodNounAuction.reducer;