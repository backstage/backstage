import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-BIybnMXI.js";import{M as j}from"./MenuBook-q0RhgAKD.js";import{S as u}from"./SearchType-BfCSx3AH.js";import{s as g,M as P}from"./api-BeLm5gjz.js";import{S as R}from"./SearchContext-xxB6vczu.js";import{S as m}from"./Grid-CKJ_Bjce.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DngtdUVl.js";import"./useAsync-35LYdSE_.js";import"./useMountedState-Dhu05aIm.js";import"./translation-CW1Sw18p.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";import"./AccordionDetails-DaKdjAtU.js";import"./index-B9sM2jn7.js";import"./Collapse-B_j-r4sF.js";import"./List-BskmEb7a.js";import"./ListContext-Dy9wnKpt.js";import"./Divider-4hCZ9_lh.js";import"./ListItem-B-2MPIj6.js";import"./ListItemIcon-B2viDiqc.js";import"./ListItemText-2j2zbfbt.js";import"./makeStyles-cGXTSjHb.js";import"./Tabs-D0z-NJME.js";import"./KeyboardArrowRight-Dtfx3yNh.js";import"./FormLabel-Bz_ajMFb.js";import"./formControlState-Cjjlyzyd.js";import"./InputLabel-DmlGQVhW.js";import"./Select-DtQ8GYv8.js";import"./Popover-Dm8aKUuZ.js";import"./Modal-R9QZiaCt.js";import"./Portal-D4Q745Gi.js";import"./MenuItem-Cko8iZkO.js";import"./Checkbox-CIk74-NH.js";import"./SwitchBase-C-8CauU2.js";import"./Chip-Du0Tzbtv.js";import"./useAnalytics-Cee1mTCP.js";import"./lodash-BF9MgLAH.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
