import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  lighten,
  makeStyles,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  Grid,
  useMediaQuery,
  Theme,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  Close,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
} from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import IOSSwitch from "../Common/IOSSwitch";
import DateRangeFilter from "./DateRangeFilter";
import moment from "moment";
import { getRestaurants } from "../../services/restaurant";
import EuroSymbolIcon from "@material-ui/icons/EuroSymbol";
import { Autocomplete } from "@material-ui/lab";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          [theme.breakpoints.down("sm")]: {
            padding: "5vh 2vh",
          },
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      margin: "1vh auto",
    },
  },
  addBtn: {
    flexShrink: 0,
    marginRight: theme.spacing(2),
    textTransform: "none",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: "1vh 0",
    },
  },
  filterContainer: {
    "&>:first-child": {
      border: "1px solid",
    },
    "&>:first-child>*": {
      flexShrink: 0,
    },
  },
}));

export type FilterType =
  | "STRING"
  | "DATE"
  | "BOOLEAN"
  | "SWITCH"
  | "NUMBER"
  | "NUMBER_INTERVAL"
  | "COMMAND_TYPE"
  | "CATEGORY"
  | "ATTRIBUTES"
  | "RESTAURANT"
  | "TYPE_PLAT"
  | "PRICE"
  | "ALLERGENE";

export type FilterSwitchOption = {
  label: string;
  value: string;
};

// type Filter<T> = {
//   id: any;
//   label: string;
//   alwaysOn?: boolean;
// } & (
//     | {
//       type: 'STRING' |
//       'DATE' |
//       'NUMBER' |
//       'CATEGORY' |
//       'COMMAND_TYPE' |
//       'RESTAURANT' |
//       'ATTRIBUTES' |
//       'TYPE_PLAT' |
//       'PRICE' |
//       'ALLERGENE'

//     }
//     | {
//       type: 'BOOLEAN';
//     }
//     | {
//       type: 'SWITCH';
//       options: FilterSwitchOption[];
//     }
//     | {
//       type: 'NUMBER_INTERVAL';
//       minLabel?: string;
//       maxLabel?: string
//     }
//     | {
//       type: 'PRICE';
//       minLabel?: string;
//       maxLabel?: string;
//     }
//   );

export type Filters = any[];

export type FilterValue = {
  value?: string | number | boolean;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  price?: Number;
  min?: Number;
  max?: Number;
  restaurant?: string;
  attributes?: string;
  allergene?: string;
};

export type FilterValues<T> = {
  [key in keyof T]?: FilterValue;
};

interface TableToolbarProps<T> {
  showAddButton?: boolean;
  addButtonLabel?: string;
  numSelected: number;
  onAddClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onDeleteClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  toValidateAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  toRefuseAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  EmporteAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  livreAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  toReadAll?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  filters?: Filters;
  onFilterValuesChange?: (id: string, value: FilterValue) => void;
  activatedFilters?: string[];
  onActivateFilter?: (id: string, type: FilterType) => void;
  onDeactivateFilter?: (id: string) => void;
  filterValues: FilterValues<T> | any;
  setFilterValues: (e: any) => void;
}

function TableToolbar<T>(props: TableToolbarProps<T>) {
  const {
    numSelected,
    showAddButton = true,
    addButtonLabel = "Ajouter",
    onAddClick,
    onDeleteClick,
    toValidateAll,
    toReadAll,
    toRefuseAll,
    filters = [],
    activatedFilters = [],
    onActivateFilter,
    onDeactivateFilter,
    filterValues,
    onFilterValuesChange,
    setFilterValues,
    EmporteAll,
    livreAll,
  } = props;

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const classes = useToolbarStyles();

  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement>();
  const [activeButtonId, setActiveButtonId] = useState<number>(2);

  const [restoOptions, setRestoOptions] = useState<any[]>([]);
  const [loadingRestaurant, setLoadingRestaurant] = useState<boolean>(false);
  const [activeType, setActiveType] = useState<boolean>(false);
  const [restaurantSelected, setRestaurantSelected] = useState<any>(false);
  const [foodType, setFoodType] = useState<any[]>([]);

  const noDuplicate = (foods: any[]) => {
    const listFoods: any[] = [];

    for (let i = 0; i < foods.length; i++) {
      for (let a = 0; a < foods[i].foodTypes.length; a++) {
        listFoods.push({
          ...foods[i].foodTypes[a],
          restoName: foods[i].name,
        });
      }
    }

    return listFoods
      .map((items: any) => (listFoods.includes(items) ? items : null))
      .filter((items: any) => items !== null);
  };

  useEffect(() => {
    getRestaurants().then((data: any) => {
      setFoodType(
        noDuplicate(data).map((d: any) => ({
          label: d.name.fr,
          value: d.name.fr,
          restoName: d.restoName,
        }))
      );
      setLoadingRestaurant(false);
      setRestoOptions(
        data.map((d: any) => ({
          label: d.name_resto_code,
          value: d.name,
          id: d._id,
        })) || []
      );
    });

    filters
      .filter(({ alwaysOn }) => !!alwaysOn)
      .forEach(({ id, type }) => {
        onActivateFilter?.(id as string, type);
      });
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRestaurantSelected]);

  const renderFilters = useCallback(() => {
    const commandTypeOptions = [
      { label: "Livraison", value: "delivery" },
      { label: "À emporter", value: "takeaway" },
      { label: "Sur place", value: "on_site" },
    ];
    return (
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        {activatedFilters
          .map((id) => filters.find(({ id: d }) => d === id))
          .map((filter: any) => {
            if (filter) {
              const { id, label, alwaysOn } = filter;

              if (filter.type === "ATTRIBUTES") {
                return (
                  <Grid item md={3} xs={6}>
                    <TextField
                      placeholder={label}
                      value={filterValues[id as keyof T]?.attributes || ""}
                      onChange={({ target: { value } }) => {
                        onFilterValuesChange?.(id as string, {
                          attributes: value,
                        });
                      }}
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              }

              if (filter.type === "ALLERGENE") {
                return (
                  <Grid item md={3} xs={6}>
                    <TextField
                      placeholder={label}
                      value={filterValues[id as keyof T]?.allergene || ""}
                      onChange={({ target: { value } }) => {
                        onFilterValuesChange?.(id as string, {
                          allergene: value,
                        });
                      }}
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              }

              if (filter.type === "STRING" || filter.type === "CATEGORY")
                return (
                  <Grid item md={3} xs={6}>
                    <TextField
                      placeholder={label}
                      value={
                        filter.type === "STRING"
                          ? filterValues[id as keyof T]?.value || ""
                          : filterValues[id as keyof T]?.category || ""
                      }
                      onChange={({ target: { value } }) => {
                        filter.type === "STRING"
                          ? onFilterValuesChange?.(id as string, { value })
                          : onFilterValuesChange?.(id as string, {
                              category: value,
                            });
                      }}
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "BOOLEAN")
                return (
                  <Grid item md={2} xs={6}>
                    <FormControlLabel
                      label={
                        <>
                          {label}
                          {!alwaysOn && (
                            <IconButton
                              onClick={() => onDeactivateFilter?.(id as string)}
                            >
                              <Close />
                            </IconButton>
                          )}
                        </>
                      }
                      control={
                        <IOSSwitch
                          checked={
                            (filterValues[id as keyof T]?.value as
                              | boolean
                              | undefined) || false
                          }
                          onChange={(_, c) =>
                            onFilterValuesChange?.(id as string, { value: c })
                          }
                        />
                      }
                    />
                  </Grid>
                );
              else if (filter.type === "SWITCH")
                return (
                  <Grid item md={2} xs={6}>
                    <Select
                      value={
                        (filterValues[id as keyof T]?.value as
                          | string
                          | undefined) || ""
                      }
                      onChange={({ target: { value } }) =>
                        onFilterValuesChange?.(id as string, {
                          value: value as string,
                        })
                      }
                    >
                      <MenuItem value="" disabled>
                        Sélectionner une option
                      </MenuItem>
                      {(filter.options as any).map((item: any) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "NUMBER")
                return (
                  <Grid item md={2} xs={6}>
                    <TextField
                      type="number"
                      placeholder={label}
                      value={filterValues[id as keyof T]?.value || ""}
                      onChange={({ target: { value } }) =>
                        onFilterValuesChange?.(id as string, {
                          value: Number(value),
                        })
                      }
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "PRICE")
                return (
                  <Grid item md={8} xs={12}>
                    <TextField
                      type="number"
                      variant="outlined"
                      style={{
                        margin: "0 0.25vh",
                      }}
                      placeholder={
                        filter.minLabel ? filter.minLabel : `Min ${label}`
                      }
                      value={
                        Number(filterValues[id as keyof T]?.min) / 100 || ""
                      }
                      onChange={({ target: { value } }) =>
                        onFilterValuesChange?.(id as string, {
                          min: Number(value) * 100,
                          max: Number(filterValues[id as keyof T]?.max),
                        })
                      }
                      InputProps={{
                        startAdornment: <EuroSymbolIcon />,
                      }}
                    />
                    <TextField
                      type="number"
                      variant="outlined"
                      style={{
                        margin: "0 0.25vh",
                      }}
                      placeholder={
                        filter.maxLabel ? filter.maxLabel : `Max ${label}`
                      }
                      value={
                        Number(filterValues[id as keyof T]?.max) / 100 || ""
                      }
                      onChange={({ target: { value } }) =>
                        onFilterValuesChange?.(id as string, {
                          min: Number(filterValues[id as keyof T]?.min),
                          max: Number(value) * 100,
                        })
                      }
                      InputProps={{
                        startAdornment: <EuroSymbolIcon />,
                      }}
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "NUMBER_INTERVAL")
                return (
                  <Grid item md={8} xs={12}>
                    <Grid container>
                      <Grid item md={5} xs={5}>
                        <TextField
                          type="number"
                          variant="outlined"
                          placeholder={
                            filter.minLabel ? filter.minLabel : `Min ${label}`
                          }
                          value={filterValues[id as keyof T]?.min || ""}
                          onChange={({ target: { value } }) =>
                            onFilterValuesChange?.(id as string, {
                              min: Number(value),
                              max: filterValues[id as keyof T]?.max,
                            })
                          }
                        />
                      </Grid>

                      <Grid item md={5} xs={5}>
                        <TextField
                          type="number"
                          variant="outlined"
                          placeholder={
                            filter.maxLabel ? filter.maxLabel : `Max ${label}`
                          }
                          value={filterValues[id as keyof T]?.max || ""}
                          onChange={({ target: { value } }) =>
                            onFilterValuesChange?.(id as string, {
                              min: filterValues[id as keyof T]?.min,
                              max: Number(value),
                            })
                          }
                        />
                        {!alwaysOn && (
                          <IconButton
                            onClick={() => onDeactivateFilter?.(id as string)}
                          >
                            <Close />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              else if (filter.type === "DATE")
                return (
                  <Grid item md={8} xs={12}>
                    <Grid container direction="row">
                      <Grid item md={4} xs={12}>
                        <DateRangeFilter
                          value={{
                            startDate: moment().subtract(6, "days").toDate(),
                            endDate: new Date(),
                          }}
                          onChange={(value) =>
                            onFilterValuesChange?.(id as string, value)
                          }
                        />
                      </Grid>
                      <Grid item md={8} xs={12} sm={12}>
                        <Grid
                          container
                          spacing={1}
                          justifyContent="flex-start"
                          alignItems="center"
                          style={{
                            position: "relative",
                            margin: "2% 0 0 0 ",
                          }}
                        >
                          <Grid item>
                            <Button
                              variant={
                                activeButtonId === 0 ? "contained" : "outlined"
                              }
                              color="primary"
                              size="small"
                              onClick={() => {
                                onFilterValuesChange?.(id as string, {
                                  startDate: moment({
                                    day: new Date().getDate(),
                                    hour: 0,
                                    minute: 0,
                                  }).toDate(),
                                  endDate: moment()
                                    .subtract(0, "days")
                                    .toDate(),
                                });
                                setActiveButtonId(0);
                              }}
                            >
                              Aujourd'hui
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant={
                                activeButtonId === 1 ? "contained" : "outlined"
                              }
                              color="primary"
                              size="small"
                              onClick={() => {
                                onFilterValuesChange?.(id as string, {
                                  startDate: moment({
                                    day: new Date(
                                      new Date().setDate(
                                        new Date().getDate() - 1
                                      )
                                    ).getDate(),
                                    hour: 0,
                                    minute: 0,
                                  }).toDate(),
                                  endDate: moment({
                                    day: new Date(
                                      new Date().setDate(
                                        new Date().getDate() - 1
                                      )
                                    ).getDate(),
                                    hour: 0,
                                    minute: 0,
                                  }).toDate(),
                                });
                                setActiveButtonId(1);
                              }}
                            >
                              Hier
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant={
                                activeButtonId === 2 ? "contained" : "outlined"
                              }
                              color="primary"
                              size="small"
                              onClick={() => {
                                onFilterValuesChange?.(id as string, {
                                  startDate: moment()
                                    .subtract(6, "days")
                                    .toDate(),
                                  endDate: new Date(),
                                });
                                setActiveButtonId(2);
                              }}
                            >
                              Derniers 7 jours
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant={
                                activeButtonId === 3 ? "contained" : "outlined"
                              }
                              color="primary"
                              size="small"
                              onClick={() => {
                                onFilterValuesChange?.(id as string, {
                                  startDate: moment()
                                    .subtract(29, "days")
                                    .toDate(),
                                  endDate: new Date(),
                                });
                                setActiveButtonId(3);
                              }}
                            >
                              Derniers 30 jours
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>

                      {!alwaysOn && (
                        <IconButton
                          onClick={() => onDeactivateFilter?.(id as string)}
                        >
                          <Close />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              else if (filter.type === "COMMAND_TYPE")
                return (
                  <Grid item md={3} xs={6}>
                    <FormControl variant="filled" style={{ width: "200px" }}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        Type de commande
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={filterValues[id as keyof T]?.value || ""}
                        onChange={({ target: { value } }) =>
                          onFilterValuesChange?.(id as string, {
                            value: value as string,
                          })
                        }
                      >
                        {commandTypeOptions.map(({ label, value }, index) => (
                          <MenuItem key={index} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "RESTAURANT")
                return (
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      noOptionsText="Aucun restaurant disponible"
                      loading={loadingRestaurant}
                      options={restoOptions}
                      getOptionLabel={(option: any) => {
                        return option.label;
                      }}
                      value={
                        restoOptions.find(
                          ({ value }) =>
                            value === filterValues[id as keyof T]?.restaurant
                        ) || null
                      }
                      onChange={(e: any, value: any) => {
                        
                        onFilterValuesChange?.(id as string, {
                          restaurant: (value.value || "") as string,
                        });

                        sessionStorage.setItem(
                          "filterSelected",
                          JSON.stringify({
                            restaurant: value.id,
                          })
                        );

                        setRestaurantSelected(value.value);

                        setActiveType(true);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Restaurant"
                        />
                      )}
                    />
                    {!alwaysOn && (
                      <IconButton
                        onClick={() => onDeactivateFilter?.(id as string)}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </Grid>
                );
              else if (filter.type === "TYPE_PLAT")
                return (
                  <Grid item md={3} xs={6}>
                    {activeType && (
                      <>
                        <FormControl
                          variant="filled"
                          style={{ width: "200px", marginRight: "8px" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={
                              filterValues[id as keyof T]?.restaurant || ""
                            }
                            onChange={({ target: { value } }) =>
                              onFilterValuesChange?.(id as string, {
                                restaurant: value as string,
                              })
                            }
                          >
                            {foodType
                              .filter(
                                (items: any) =>
                                  items.restoName === restaurantSelected
                              )
                              .map(({ label, value }: any, index: number) => (
                                <MenuItem key={index} value={value}>
                                  {label}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {!alwaysOn && (
                          <IconButton
                            onClick={() => onDeactivateFilter?.(id as string)}
                          >
                            <Close />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Grid>
                );
            }

            return null;
          })}
      </Grid>
    );
  }, [
    activatedFilters,
    classes.filterContainer,
    filterValues,
    filters,
    onDeactivateFilter,
    onFilterValuesChange,
    activeButtonId,
    restoOptions,
    activeType,
    foodType,
    loadingRestaurant,
    restaurantSelected,
  ]);

  return (
    <>
      {numSelected > 0 ? (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item>
              <Typography className={classes.title} color="primary">
                {`${numSelected} ligne${
                  numSelected > 1 ? "s" : ""
                } sélectionnée${numSelected > 1 ? "s" : ""}`}
              </Typography>
            </Grid>

            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Tooltip title="Supprimer">
                    <IconButton aria-label="delete" onClick={onDeleteClick}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>

                {toValidateAll && (
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                      }}
                      startIcon={<CheckIcon />}
                      className={classes.addBtn}
                      onClick={toValidateAll}
                    >
                      Tout valider
                    </Button>
                  </Grid>
                )}

                {toRefuseAll && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ClearIcon />}
                      className={classes.addBtn}
                      onClick={toRefuseAll}
                    >
                      Tout refuser
                    </Button>
                  </Grid>
                )}

                {toReadAll && (
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                      }}
                      startIcon={<VisibilityIcon />}
                      className={classes.addBtn}
                      onClick={toReadAll}
                    >
                      Marquer tous comme lus
                    </Button>
                  </Grid>
                )}

                {EmporteAll && (
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                      }}
                      startIcon={<DirectionsRunIcon />}
                      className={classes.addBtn}
                      onClick={EmporteAll}
                    >
                      Tous emporter
                    </Button>
                  </Grid>
                )}

                {livreAll && (
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                      }}
                      startIcon={<DirectionsBikeIcon />}
                      className={classes.addBtn}
                      onClick={livreAll}
                    >
                      Tous livrer
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              float: "right",
              right: mdUp ? "2%" : "5%",
            }}
          >
            <Tooltip title="Filtrer la liste">
              <IconButton
                aria-label="filter list"
                onClick={(e) => {
                  !!filters.filter(
                    ({ id }) => !activatedFilters.find((k) => k === id)
                  ).length && setFilterAnchor(e.currentTarget);
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            <Menu
              open={!!filterAnchor}
              onClose={() => setFilterAnchor(undefined)}
              anchorEl={filterAnchor}
            >
              {filters
                ?.filter(({ id }) => !activatedFilters.find((k) => k === id))
                .map(({ id, label, type }) => (
                  <MenuItem
                    onClick={() => {
                      setFilterAnchor(undefined);
                      onActivateFilter?.(id as string, type);
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
            </Menu>
          </div>

          <div
            style={{
              position: mdUp ? "absolute" : "relative",
              float: "right",
              right: mdUp ? "7%" : "7%",
              margin: "1vh 0",
            }}
          >
            <Box flex={1} />

            {showAddButton && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                className={classes.addBtn}
                onClick={onAddClick}
              >
                {addButtonLabel}
              </Button>
            )}

            {Object.keys(filterValues).length > 0 &&
              !!filterValues?.restaurant && (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<RotateLeftIcon />}
                  className={classes.addBtn}
                  onClick={() => {
                    setFilterValues({})
                      sessionStorage.removeItem("filterSelected");
                    }
                  }
                >
                  Reset
                </Button>
              )}
          </div>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Grid item xs={11}>
              {renderFilters()}
            </Grid>
          </Grid>
          <br />
          <br />
        </>
      )}
    </>
  );
}

export default TableToolbar;
