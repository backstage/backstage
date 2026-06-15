import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-NUkawwzR.js";import{M as j}from"./MenuBook--Wx4eeve.js";import{S as u}from"./SearchType-BPBfpc5C.js";import{s as g,M as R}from"./api-DKL7dYhy.js";import{S as q}from"./SearchContext-U9kLs7rN.js";import{S as m}from"./Grid-CTlAuf7X.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Dy63TlFt.js";import"./useAsync-CsDFyt-v.js";import"./useMountedState-C9EMhPTC.js";import"./translation-pyJsmzOb.js";import"./Box-uNF0ND2L.js";import"./styled-CoNMgIxM.js";import"./AccordionDetails-0bwbjF9s.js";import"./index-B9sM2jn7.js";import"./Collapse-P9G19jA8.js";import"./List-B-MMhnOL.js";import"./ListContext-MI5-zAg3.js";import"./Divider-D6wa_gko.js";import"./ListItem-B_oYa0lB.js";import"./ListItemIcon-oyRan6I8.js";import"./ListItemText-Cc9q0K8Y.js";import"./makeStyles-CNV3hMKY.js";import"./Tabs-BbojancF.js";import"./KeyboardArrowRight-CY8FCg03.js";import"./FormLabel-C3Z0rJj_.js";import"./formControlState-D1Be7FHd.js";import"./InputLabel-DjWX1mI9.js";import"./Select-4PvEmGMm.js";import"./Popover-2iYb6kWG.js";import"./Modal-DAR7GsXJ.js";import"./Portal-BgDfH8Z8.js";import"./MenuItem-Bq0NnDem.js";import"./Checkbox-D26s0v4F.js";import"./SwitchBase-B5toueCm.js";import"./Chip-flVuIIc2.js";import"./useAnalytics-D_vtRMir.js";import"./lodash-BZMNBUXh.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...s.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Te as __namedExportsOrder,ye as default};
