import { useCallback, useEffect, useState } from "react";
import { Dashboard as DashboardIcon } from "@material-ui/icons";
import PageHeader from "../components/Admin/PageHeader";
import { useSnackbar } from "notistack";
import EventEmitter from "../services/EventEmitter";
import MediaCard from "../components/Common/Card";
import { getDashboard } from "../services/dashboard";
import { useAuth } from "../providers/authentication";

const DashboardListPage = () => {
  
  const [dashboard, setDashboard] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { isRestaurantAdmin, restaurant } = useAuth();

  const fetch = useCallback(() => {
    setDashboard([]);
    getDashboard(isRestaurantAdmin ? restaurant?._id : "admin")
      .then((data) => {
        setDashboard(data);
      })
      .catch(() => {
        enqueueSnackbar("Erreur lors du chargement des données...", {
          variant: "error",
        });
      })
      .finally(() => {});
  }, [enqueueSnackbar]);

  useEffect(() => {
    const onRefresh = () => {
      fetch();
    };

    EventEmitter.on("REFRESH", onRefresh);

    return () => {
      EventEmitter.removeListener("REFRESH", onRefresh);
    };
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subTitle="Commande | Chiffre d'affaire"
        icon={DashboardIcon}
      />
      {dashboard.best_resto_day && (
        <MediaCard
          dashboardDay={dashboard.dashboard_day}
          dashboardWeek={dashboard.dashboard_week}
          dashboardMonth={dashboard.dashboard_month}
          dashboardYear={dashboard.dashboard_year}
          chiffreAffaireDay={dashboard.chiffre_affaire_day}
          chiffreAffaireWeek={dashboard.chiffre_affaire_week}
          chiffreAffaireMonth={dashboard.chiffre_affaire_month}
          chiffreAffaireYear={dashboard.chiffre_affaire_year}
          BestRestoDayName={dashboard.best_resto_day[0]?.resto}
          BestRestoCommande={dashboard.best_resto_day[0]?.nombre_commande}
          BestRestoSomme={dashboard.best_resto_day[1]?.price}
          BestRestoWeekName={dashboard.best_resto_week[0]?.resto}
          BestRestoWeekSomme={
            dashboard.best_resto_week.length > 1
              ? dashboard.best_resto_week[2]?.price
              : dashboard.best_resto_week[1]?.price
          }
          BestRestoWeekCommande={dashboard.best_resto_week[0]?.nombre_commande}
          BestRestoMonthName={dashboard.best_resto_month[0]?.resto}
          BestRestoMonthSomme={dashboard.best_resto_month[1]?.price}
          BestRestoMonthCommande={
            dashboard.best_resto_month[0]?.nombre_commande
          }
          BestRestoYearName={dashboard.best_resto_year[0]?.resto}
          BestRestoYearSomme={dashboard.best_resto_year[1]?.price}
          BestRestoYearCommande={dashboard.best_resto_year[0]?.nombre_commande}
        />
      )}
    </>
  );
};

export default DashboardListPage;
