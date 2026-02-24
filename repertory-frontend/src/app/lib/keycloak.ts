import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "homeo-realm",
  clientId: "nextjs-client",
});

export default keycloak;