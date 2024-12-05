import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import userReducer from './userSlice'; // Import your user slice

// Combine all reducers into one
const rootReducer = combineReducers({
    user: userReducer, // Add more reducers if needed
});

// Configure persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // Only persist the user slice
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable the serializable check because of redux-persist
        }),
});

export const persistor = persistStore(store); // Create a persistor instance

export default store;
