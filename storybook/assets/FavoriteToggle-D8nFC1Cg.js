import{j as e}from"./jsx-runtime-CvpxdxdE.js";import{m as l}from"./makeStyles-yUUo8jj4.js";import{T as c}from"./Tooltip-BZbacX7V.js";import{I as p}from"./IconButton-Ckj9xv_i.js";import{T as d}from"./Typography-C4wK928C.js";import{S as u,U as m}from"./icons-BT-7R_NK.js";const g=l(()=>({icon:{color:"#f3ba37",cursor:"pointer",display:"inline-flex"},iconBorder:{color:"inherit",cursor:"pointer",display:"inline-flex"}}),{name:"BackstageFavoriteToggleIcon"});function t(i){const{isFavorite:o}=i,n=g();return e.jsx(d,{component:"span",className:o?n.icon:n.iconBorder,children:o?e.jsx(u,{}):e.jsx(m,{})})}function T(i){const{id:o,title:n,isFavorite:r,onToggle:a,...s}=i;return e.jsx(c,{id:o,title:n,children:e.jsx(p,{"aria-label":n,id:o,onClick:()=>a(!r),color:"inherit",...s,children:e.jsx(t,{isFavorite:r})})})}t.__docgenInfo={description:`Icon used in FavoriteToggle component.

Can be used independently, useful when used as {@link @material-table/core#MaterialTableProps.actions} in {@link @material-table/core#MaterialTable}

@public`,methods:[],displayName:"FavoriteToggleIcon",props:{isFavorite:{required:!0,tsType:{name:"boolean"},description:""}}};T.__docgenInfo={description:`Toggle encapsulating logic for marking something as favorite,
primarily used in various instances of entity lists and cards but can be used elsewhere.

This component can only be used in as a controlled toggle and does not keep internal state.

@public`,methods:[],displayName:"FavoriteToggle",props:{id:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},isFavorite:{required:!0,tsType:{name:"boolean"},description:""},onToggle:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};export{T as F};
