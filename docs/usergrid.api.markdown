##

### apigee.ApiClient

init
getOrganizationName
setOrganizationName
getOrganizationUUID
setOrganizationUUID
getApplicationName
setApplicationName
getToken
setToken
getAppUserUsername
setAppUserUsername
getAppUserFullName
setAppUserFullName
getAppUserEmail
setAppUserEmail
getAppUserUUID
setAppUserUUID
getApiUrl
setApiUrl
getResetPasswordUrl
runAppQuery
runManagementQuery
loginAppUser
createAppUser
updateAppUser
renewAppUserToken
logoutAppUser
isLoggedInAppUser
processQuery
encodeParams


### apigee.validation


validateUsername
getUsernameAllowedChars
validateName
getNameAllowedChars
validatePassword
getPasswordAllowedChars
validateEmail
getEmailAllowedChars
validatePath
getPathAllowedChars
validateTitle
getTitleAllowedChars
isUUID


### apigee.QueryObj

  /**
   *  @constructor
   *  @param {string} method
   *  @param {string} path
   *  @param {object} jsonObj
   *  @param {object} queryParams
   *  @param {function} successCallback
   *  @param {function} failureCallback
   */
setAll
getMethod
setMethod
getPath
setPath
getJsonObj
setJsonObj
getQueryParams
setQueryParams
getSuccessCallback
setSuccessCallback
callSuccessCallback
getFailureCallback
setFailureCallback
callFailureCallback
getCurl
setCurl
getToken
setToken
resetPaging
hasPrevious
getPrevious
hasNext
getNext
saveCursor
getCursor

### apigee.Entity

getCollectionType
setCollectionType
getUUID
setUUID
getName
setName
getData
setData
clearData
getField
setField
deleteField
processResponse
save
get
destroy

### apigee.User


  apigee.User.prototype = new apigee.Entity();

setUsername
getUsername


### apigee.Collection

getPath
setPath
getUUID
setUUID
addEntity
getEntityByField
getEntityByUUID
getFirstEntity
getLastEntity
hasNextEntity
getNextEntity
hasPreviousEntity
getPreviousEntity
resetEntityPointer
getEntityList
setEntityList
hasNextPage
getNextPage
hasPreviousPage
getPreviousPage
clearQueryObj
setQueryParams
get
save