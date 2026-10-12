import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-GY9q4FO8.js";import{M as j}from"./MenuBook-DyZ345Mi.js";import{S as u}from"./SearchType-B22y_yL3.js";import{s as g,M as P}from"./api-B1ZAIvuT.js";import{S as R}from"./SearchContext-DGUf_VK5.js";import{S as m}from"./Grid-B0Qn3Dnm.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-mPh2u-wz.js";import"./useAsync-Dcd2mgGY.js";import"./useMountedState-Dc2o9XUu.js";import"./translation-BDeTo7uN.js";import"./Box-BD1hfHK_.js";import"./styled-gNaRwUS_.js";import"./AccordionDetails-DlHqPWZU.js";import"./index-B9sM2jn7.js";import"./Collapse-BzXHHZIv.js";import"./List-WDJE0HvX.js";import"./ListContext-Dnh-YOBQ.js";import"./Divider-D09MS3Wy.js";import"./ListItem-ChY-Ftn4.js";import"./ListItemIcon-DCGmOeYQ.js";import"./ListItemText-Bk-2uhgD.js";import"./makeStyles-2U49SRly.js";import"./Tabs-CehZg5pt.js";import"./KeyboardArrowRight-DUinmb53.js";import"./FormLabel-DIGofW-H.js";import"./formControlState-CJvsMeN_.js";import"./InputLabel-5DMDlP4h.js";import"./Select-DhnQmF0Y.js";import"./Popover-DnZsmbxs.js";import"./Modal-bfkZlVQi.js";import"./Portal-wY1dwSda.js";import"./MenuItem-JiVuY5yn.js";import"./Checkbox-lW-v4dZZ.js";import"./SwitchBase-CpiERV1l.js";import"./Chip-CjGpRCIX.js";import"./useAnalytics-ChuvGTuC.js";import"./lodash-DzeDbzRd.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
