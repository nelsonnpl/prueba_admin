# Panel administrador


  * admin.html

--> .cardBox

Estos están referidos a una visión general de la situación channel, habiendo cuatro elementos:

    * Visitas --> [número de visitas --> (1500)]
      - Aquí se contabiliza el número de visitas que se han hecho en total a todos los posts

    * Posts --> [número de posts --> (70)]
      - Aquí se contabiliza el número de post PUBLICADOS no los que estan pendientes de publicar u ocultos

    * Visitas Youtube --> número de visitas a la página de youtube
      - Aquí se contabiliza el número de visitas a la página de youtube

    * Instagram --> número de visitas a la página de instagram
      - Aquí se contabiliza el número de visitas a la página de instagram


--> Post Recientes

    * Título

      - En este colorcar el título del post

    * Visitas

      - Número de visitas totales al post


    * Editor

      - Nombre del editor que ha publicado el post

    * Estado

      - En este punto puede haber 3 posibilidades:

        - Publicado (Verde)

        .status-delivered {
          padding: 2px 4px;
          background: #0fbe5e;
          color: var(--white);
          border-radius: 4px;
          font-weight: 500;
        }

        - Pendiente (Naranja)

        .status-pending {
          padding: 2px 4px;
          background: #ffc107;
          color: var(--white);
          border-radius: 4px;
          font-weight: 500;
        }

        - Eliminado (Rojo)

        .status-deleted {
          padding: 2px 4px;
          background: #ff5252;
          color: var(--white);
          border-radius: 4px;
          font-weight: 500;
        }

    * 'All Posts' --> [botón]
      - Te dirige a *admin_post.html donde están todos los posts agrupados para ver en forma de tabla habiendo los siguientes datos:

        º Título
        º Fecha
        º Editor
        º Visitas --> Número de visitas totales al post
        º Botón 'Editar'








