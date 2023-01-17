(function transformRow(source, target, map, log, isUpdate) {
	var ligneInfo = "ligne=" + source.sys_import_row + ";code_barre=" + source.u_code_barre;
    error_message = '';

    if ('insert' == action) {
        // interface en mise à jour seulement
        error = true;
        error_message += "Manquant;"+ligneInfo;
		gs.logError(error_message,'TM_CATS_CMDB_BDDH');
    }
	else if ('update' == action) {
        /*Conformité du numéro de série :
          Contrôle numéro de série (en BDDH) = numéro de série (en CMDB)
          	Si différent, alors pas de mise à jour en CMDB, alors c'est une anomalie
        */
        if (source.u_numero_de_serie != target.serial_number) {
            error = true;
            error_message += "Incohérent:numéro de série différent;"+ligneInfo;
			gs.logError(error_message,'TM_CATS_CMDB_BDDH');
        }

        /*	Conformité de l'état du matériel :
        o	Si en BDDH Etat = « Sorti du site », en CMDB, le matériel doit être Retiré. Pour le matériel Sorti du site, il ne faut pas mettre à jour la localisation de la CMDB. Si le CI n'est pas à Retiré, alors c'est une anomalie 
        o	Si en BDDH Etat = « Au stock », en CMDB, le matériel doit être En stock. Si le CI n'est pas à En stock, alors c'est une anomalie
        o	Si en BDDH Etat = « Déployé », en CMDB, le matériel doit être tout sauf Retiré, En commande ou Manquant. Sinon, c'est une anomalie
		*/
		//gs.log('source.u_etat '+source.u_etat +'target.install_status '+target.install_status,'TM_CATS_CMDB_BDDH');
        if ('Sorti du site' == source.u_etat 
			&& 7 != target.install_status) {
            error = true;
            error_message += "Incohérent:Etat = « Sorti du site »;"+ligneInfo;
			gs.logError(error_message,'TM_CATS_CMDB_BDDH');
        }
        if ('Au stock' == source.u_etat 
			&& 6 != target.install_status) {
            error = true;
            error_message += "Incohérent:Etat = « Au stock »;"+ligneInfo;
			gs.logError(error_message,'TM_CATS_CMDB_BDDH');
        }
        // liste des valeurs install_status non valide pour l'état Déployé
        if ('Déployé' == source.u_etat 
			&& ( 100 == target.install_status || 2 == target.install_status || 7 == target.install_status )) {
            error = true;
            error_message += "Incohérent:Etat = « Déployé »;"+ligneInfo;
			gs.logError(error_message,'TM_CATS_CMDB_BDDH');
        }

        /*	Existence et validité de l'emplacement en CMDB :
        o	L'emplacement indiqué en BDDH doit correspondre à un emplacement existant en CMDB
        */
		if ('Sorti du site' != source.u_etat ){
			grEmplacement = new GlideRecord('cmn_location');
			if (!grEmplacement.get('sys_id',source.u_emplacement)) {
				error = true;
				error_message += "Incohérent:Emplacement inexistant;"+ligneInfo;
				gs.logError(error_message,'TM_CATS_CMDB_BDDH');
			}
		}
		else {
			ignore = true; // on ignore la mise à jour en cas de 'Sorti du site'
		}
		//gs.log("test XXX;"+ligneInfo+";"+error_message,'TM_CATS_CMDB_BDDH');

    } 
	
})(source, target, map, log, action === "update");
