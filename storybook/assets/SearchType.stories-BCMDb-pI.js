import{aN as h,aO as y,aP as T,aQ as x,aD as S,j as e,P as _,$ as V}from"./iframe-Cz6SWQVH.js";import{M as j}from"./MenuBook-Zwzt-56q.js";import{S as u}from"./SearchType-D9mdxPSB.js";import{s as P,M as g}from"./api-BwTE7cWZ.js";import{S as D}from"./SearchContext-3CcKjcM0.js";import{S as m}from"./Grid-vJ4N4mtA.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-VjMAX4xv.js";import"./useAsync-DBMJljw9.js";import"./useMountedState-BtaJiN7o.js";import"./translation-BjXqW7er.js";import"./Box-BfOwOGWn.js";import"./styled-CHQDB4JG.js";import"./AccordionDetails-CGZDKfZJ.js";import"./index-B9sM2jn7.js";import"./Collapse-Bcgk9z9C.js";import"./List-CPTtSvEh.js";import"./ListContext-BZcjIfXN.js";import"./Divider-BnJfzwCx.js";import"./ListItem-Co51ld_D.js";import"./ListItemIcon-IclZHLVb.js";import"./ListItemText-BXEA_G4I.js";import"./makeStyles-DkpM-pcx.js";import"./Tabs-C4FxLYMg.js";import"./KeyboardArrowRight-BzVk1t35.js";import"./FormLabel-C0sepyRi.js";import"./formControlState-CnyRz5rd.js";import"./InputLabel-BTrcsB0a.js";import"./Select-BCG14GOZ.js";import"./Popover-CLTNTp2m.js";import"./Modal-CRoJIq51.js";import"./Portal-Cwv6n3co.js";import"./MenuItem-DRGiAVo4.js";import"./Checkbox-BNpdIv2N.js";import"./SwitchBase-COJRjyid.js";import"./Chip-C-4MhTGz.js";import"./useAnalytics-D119RZa6.js";import"./lodash-BYoV5fke.js";var a={},d;function R(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var q=R();const I=S(q);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const O=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new g]],children:e.jsx(D,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(O,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
