import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-DvObL_em.js";import{M as j}from"./MenuBook-BR7_48NK.js";import{S as u}from"./SearchType-3fpYY1RB.js";import{s as g,M as P}from"./api-DyhUSvEH.js";import{S as R}from"./SearchContext-CCXPdnuE.js";import{S as m}from"./Grid-D0oIIaci.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BPw42VZj.js";import"./useAsync-C_QuVvY4.js";import"./useMountedState-qWdGL57P.js";import"./translation-C3DoqgrH.js";import"./Box-vIlJQZHO.js";import"./styled-BUTQ37RD.js";import"./AccordionDetails-BjGpGUQw.js";import"./index-B9sM2jn7.js";import"./Collapse-nQM4YuR3.js";import"./List-2eV0WyBd.js";import"./ListContext-DWdyoQ2B.js";import"./Divider-DztT0DPF.js";import"./ListItem-HID7QX3w.js";import"./ListItemIcon-MnOYk2wQ.js";import"./ListItemText-CdvKngye.js";import"./makeStyles-CUBlkZ58.js";import"./Tabs-BcynlknK.js";import"./KeyboardArrowRight-Cg4dpWUn.js";import"./FormLabel-6zQvpG9u.js";import"./formControlState-yx52LODs.js";import"./InputLabel-BCE48HF7.js";import"./Select-CV1157nr.js";import"./Popover-cEldhMRk.js";import"./Modal-BYBpZn83.js";import"./Portal-ByK_zElx.js";import"./MenuItem-CO-fJq-B.js";import"./Checkbox-Df_8UGYv.js";import"./SwitchBase-C-shzB_M.js";import"./Chip-CBViW5JN.js";import"./useAnalytics-Cik4L6Xq.js";import"./lodash-BX0jKKjM.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
