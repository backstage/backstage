import{cd as h,ce as y,ch as T,cc as x,bs as S,bQ as e,P as _,a4 as V}from"./iframe-CdNUyns1.js";import{M as j}from"./MenuBook-nC9n1_xC.js";import{S as u}from"./SearchType-BXrnLMke.js";import{s as g,M as P}from"./api-CJ6_TV01.js";import{S as R}from"./SearchContext-rED9KIgs.js";import{S as m}from"./Grid-CuUKwjma.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CAqCuZZf.js";import"./useAsync-BIYaz7CT.js";import"./useMountedState-CtNbdOCx.js";import"./translation-CLxMRPs7.js";import"./Box-DFc3IFyj.js";import"./styled-_ZZ8vobE.js";import"./AccordionDetails-wdruAoAq.js";import"./index-B9sM2jn7.js";import"./Collapse--EAsaz9T.js";import"./List-DcrVr_XM.js";import"./ListContext-BojgFJwk.js";import"./Divider-C8Hu2NoW.js";import"./ListItem-DgRPj49U.js";import"./ListItemIcon-CVinhI_C.js";import"./ListItemText-0KNl44ZE.js";import"./makeStyles-CHAgNhAt.js";import"./Tabs-a5du_lIg.js";import"./KeyboardArrowRight-BD7OpGVR.js";import"./FormLabel-BmtcblOH.js";import"./formControlState-DIWfvR0L.js";import"./InputLabel-lMvTG7Qr.js";import"./Select-D_mtbcrT.js";import"./Popover-AOZv038h.js";import"./Modal-CmDcDVn6.js";import"./Portal-DUmhVnUE.js";import"./MenuItem-DiuqvzX3.js";import"./Checkbox-G87e910S.js";import"./SwitchBase-D1CkN1fr.js";import"./Chip-BWU18IBI.js";import"./useAnalytics-uPHW0hxD.js";import"./lodash-LaLztEdN.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),s=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),i=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Accordion"};i.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{s as Accordion,t as Default,i as Tabs,Te as __namedExportsOrder,ye as default};
