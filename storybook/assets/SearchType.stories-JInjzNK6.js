import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-DQtIir6_.js";import{M as j}from"./MenuBook-yNWRF068.js";import{S as u}from"./SearchType-0IaBxN1L.js";import{s as g,M as R}from"./api-C0Hpf04Q.js";import{S as q}from"./SearchContext-hprKWKlc.js";import{S as m}from"./Grid-DtwO6FOq.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Dx9L6UHV.js";import"./useAsync-B2B92X5M.js";import"./useMountedState-DRMZFfHM.js";import"./translation-CUSd4MWU.js";import"./Box-O4mveAiq.js";import"./styled-BhIgo9Dl.js";import"./AccordionDetails-CEs8-W4z.js";import"./index-B9sM2jn7.js";import"./Collapse-ELObKcrO.js";import"./List-C72_ZxQh.js";import"./ListContext-f0KYlYlh.js";import"./Divider-D3NWx-U1.js";import"./ListItem-D7j56-L5.js";import"./ListItemIcon-DO2sfe6B.js";import"./ListItemText-CKhQJenL.js";import"./makeStyles-BGUJ1R1k.js";import"./Tabs-DxPZP4eB.js";import"./KeyboardArrowRight-BV0_ngRd.js";import"./FormLabel-BJokof78.js";import"./formControlState-CbzeOxjM.js";import"./InputLabel-D4btWAoE.js";import"./Select-C2P1Z_wW.js";import"./Popover-BRg3kGS4.js";import"./Modal-DHjFoe6o.js";import"./Portal-D45Xwtom.js";import"./MenuItem-BbQSzdIZ.js";import"./Checkbox-Ba4J6pAu.js";import"./SwitchBase-hUeNWt4x.js";import"./Chip-B3LAKOnj.js";import"./useAnalytics-Nt1lbfmh.js";import"./lodash-BeLSVBlD.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
