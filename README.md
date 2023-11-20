# Hopverkefni2

## Einkunnagjöf
* 10% - README eftir forskrift, tæki og tól uppsett, vefur keyrir á Netilfy. Lint fyrir CSS/Sass og JavaScript.
* 10% - Git notað og PR eftir forskrift.
* Almenn tenging við vefþjónustur, „loading state“ og villumeðhöndlun.
    * https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/
* 10% – Almennt útlit og skalanleiki.
* 10% – Forsíða.
    * Á forsíðu skal birta sex nýjustu vörur með því að kalla á /products?limit=6. Birta skal fyrir vörur:
    * Titil
    * Mynd
    * Verð
    * Heiti flokks
    * Hver vara skal vera hlekkur á viðeigandi vörusíðu.
    * Fyrir neðan vörur skal vera hlekkur sem fer á vörulista með öllum vörum.
* 10% – Vörulisti.
    * Vörulisti birtir allar vörur með því að kalla á /products. Birta skal fyrir vörur:
    * Titil
    * Mynd
    * Verð
    * Heiti flokks
    * Hver vara skal vera hlekkur á viðeigandi vörusíðu.
    * Fyrir neðan vörur skal vera hlekkur sem fer á forsíðu.
* 20% – Vörusíða.
    * Vörusíða birtir vöru með því að kalla á /products/{id}. Birta skal fyrir vöru:
    * Titil
    * Mynd
    * Verð
    * Heiti flokks
    * Lýsingu á vöru
    * Fyrir neðan vöru skal birta þrjár sambærilegar vörur með því að kalla á /products?limit=3&category={category} þar sem {category} er auðkenni flokks vörunnar.
* 20% – Valin virkni.
    * Stuðningar við flokka: nota /categories til að birta flokka á forsíðu og /products?category={id} til að birta vörur á flokkasíðu.
    * Stuðningur við síðuflettingu: nota /products?offset={offset}&limit={limit} til að birta vörur á síðu og hafa síðuflettingu á vörulistasíðu.
    * Stuðningur við leit: með því að nota /products?search={query} og leita þannig í vörum, birta niðurstöður eða ef engar niðurstöður. Geyma skal leit í URL svo hægt sé að leita aftur.
