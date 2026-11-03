import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-BteMx7zj.js";import{M as j}from"./MenuBook-3z0vUAi4.js";import{S as u}from"./SearchType-DkVoXnb-.js";import{s as g,M as P}from"./api-BjMO7ARA.js";import{S as R}from"./SearchContext-B4DQRosL.js";import{S as m}from"./Grid-D5ZyNHnh.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CLriPX-N.js";import"./useAsync-DyWgphio.js";import"./useMountedState-CHelMk4j.js";import"./translation-Cm3siiX-.js";import"./Box-DCV742gE.js";import"./styled-DB7WYmRd.js";import"./AccordionDetails-cmey2Utz.js";import"./index-B9sM2jn7.js";import"./Collapse-7fl1HXkq.js";import"./List-B42bmojS.js";import"./ListContext-C3evAAl8.js";import"./Divider-DGB92JHx.js";import"./ListItem-DaGBUtFz.js";import"./ListItemIcon-DcluqsoI.js";import"./ListItemText-9BhXH5Ta.js";import"./makeStyles-DGUes2su.js";import"./Tabs-BDw9oo2U.js";import"./KeyboardArrowRight-BX-MrySi.js";import"./FormLabel-4cDdK8eJ.js";import"./formControlState-BNx9JnCw.js";import"./InputLabel-Bker0e8v.js";import"./Select-BT4b-sd-.js";import"./Popover-B0Ta9ckA.js";import"./Modal-JBVGh4cr.js";import"./Portal-4hBbtLI0.js";import"./MenuItem-2Wr3LLZM.js";import"./Checkbox-5UQG1Aij.js";import"./SwitchBase-BKvc6rmp.js";import"./Chip-DvzUIdKO.js";import"./useAnalytics-CzrCeQK4.js";import"./lodash-DsduVVuc.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
