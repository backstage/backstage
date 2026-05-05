import{aQ as h,aR as T,aS as y,aT as S,aE as x,j as e,P as _,a2 as V}from"./iframe-D7zjeBit.js";import{M as j}from"./MenuBook-BvCCy2FT.js";import{S as u}from"./SearchType-C9ZhJYOT.js";import{s as R,M as g}from"./api-CCo5-scy.js";import{S as P}from"./SearchContext-D2vdUOrz.js";import{S as m}from"./Grid-BwBMybgh.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CHCoKjrA.js";import"./useAsync-Dqyaj-jN.js";import"./useMountedState-kWf6Idih.js";import"./translation-CciJukug.js";import"./Box-eqPq7tDA.js";import"./styled-Cto7NXi2.js";import"./AccordionDetails-yQUU3RTP.js";import"./index-B9sM2jn7.js";import"./Collapse-CIrQlr20.js";import"./List-_IcS7A5z.js";import"./ListContext-338I8pjt.js";import"./Divider-B8mQbTru.js";import"./ListItem-PR8H70fv.js";import"./ListItemIcon-DY3Cfta7.js";import"./ListItemText-vMMeAjTD.js";import"./makeStyles-BdLugvEp.js";import"./Tabs-CdZGL-kK.js";import"./KeyboardArrowRight-IfS9RgkQ.js";import"./FormLabel-De5-AHD7.js";import"./formControlState-Be-np0TU.js";import"./InputLabel-DwExugKT.js";import"./Select-BW0qQiBP.js";import"./Popover-BLVU7E1s.js";import"./Modal-CKF7dnop.js";import"./Portal-B4c0pg-w.js";import"./MenuItem-RejvdPIb.js";import"./Checkbox-DhSSoNPx.js";import"./SwitchBase-DEr-BGOx.js";import"./Chip-BBqdvmfX.js";import"./useAnalytics-CJoDpLKX.js";import"./lodash-CaiQO1ZN.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=T();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=T();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),Te={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[R,new g]],children:e.jsx(P,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const ye=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,ye as __namedExportsOrder,Te as default};
