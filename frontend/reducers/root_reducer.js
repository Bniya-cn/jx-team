import { combineReducers } from "redux";
import entitiesReducer from "./entities_reducer";
import errorsReducer from "./errors_reducer";
import sessionReducer from "./session_reducer";
import localeReducer from "./locale_reducer";
import translationOverrideReducer from "./translation_override_reducer";

export default combineReducers({
    entities: entitiesReducer,
    errors: errorsReducer,
    session: sessionReducer,
    locale: localeReducer,
    translationOverrides: translationOverrideReducer,
});