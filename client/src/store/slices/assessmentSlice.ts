import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IAssignment, AssignmentStatus } from '../../types';

interface AssessmentState {
  currentAssignmentId: string | null;
  generationStatus: {
    status: AssignmentStatus;
    message: string;
  } | null;
}

const initialState: AssessmentState = {
  currentAssignmentId: null,
  generationStatus: null,
};

export const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentAssignmentId: (state, action: PayloadAction<string | null>) => {
      state.currentAssignmentId = action.payload;
    },
    setGenerationStatus: (
      state,
      action: PayloadAction<{ status: AssignmentStatus; message: string }>
    ) => {
      state.generationStatus = action.payload;
    },
    resetAssessmentState: () => initialState,
  },
});

export const { setCurrentAssignmentId, setGenerationStatus, resetAssessmentState } = assessmentSlice.actions;
export default assessmentSlice.reducer;
