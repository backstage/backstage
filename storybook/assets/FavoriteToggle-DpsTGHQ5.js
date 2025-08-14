import{j as e}from"./jsx-runtime-hv06LKfz.js";import{T as l}from"./Tooltip-fGAyvfC5.js";import{I as c}from"./IconButton-tgA3biVt.js";import{m as p}from"./makeStyles-CJp8qHqH.js";import{T as d}from"./Typography-NhBf-tfS.js";import{S as u,U as m}from"./icons-xR9lph2y.js";const g=p(()=>({icon:{color:"#f3ba37",cursor:"pointer",display:"inline-flex"},iconBorder:{color:"inherit",cursor:"pointer",display:"inline-flex"}}),{name:"BackstageFavoriteToggleIcon"});function t(i){const{isFavorite:o}=i,n=g();return e.jsx(d,{component:"span",className:o?n.icon:n.iconBorder,children:o?e.jsx(u,{}):e.jsx(m,{})})}function T(i){const{id:o,title:n,isFavorite:r,onToggle:a,...s}=i;return e.jsx(l,{id:o,title:n,children:e.jsx(c,{"aria-label":n,id:o,onClick:()=>a(!r),color:"inherit",...s,children:e.jsx(t,{isFavorite:r})})})}t.__docgenInfo={description:`Icon used in FavoriteToggle component.

Can be used independently, useful when used as {@link @material-table/core#MaterialTableProps.actions} in {@link @material-table/core#MaterialTable}

@public`,methods:[],displayName:"FavoriteToggleIcon",props:{isFavorite:{required:!0,tsType:{name:"boolean"},description:""}}};T.__docgenInfo={description:`Toggle encapsulating logic for marking something as favorite,
primarily used in various instances of entity lists and cards but can be used elsewhere.

This component can only be used in as a controlled toggle and does not keep internal state.

@public`,methods:[],displayName:"FavoriteToggle",props:{id:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},isFavorite:{required:!0,tsType:{name:"boolean"},description:""},onToggle:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};export{T as F};
