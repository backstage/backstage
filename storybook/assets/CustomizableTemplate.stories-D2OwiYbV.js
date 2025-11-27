import{j as t,T as i,c as m,C as a}from"./iframe-B6vHPHUS.js";import{w as n}from"./appWrappers-m0dyImYt.js";import{s as p,H as s}from"./plugin-DQc5LMbC.js";import{c as d}from"./api-B7obBOnv.js";import{c}from"./catalogApiMock-C4Kp4PqQ.js";import{M as g}from"./MockStarredEntitiesApi-BX0wHfXs.js";import{s as l}from"./api-C-mL8dKS.js";import{C as h}from"./CustomHomepageGrid-CBBsgEUr.js";import{H as f,a as u}from"./plugin-Cr81OckD.js";import{e as y}from"./routes-DV9DM-2U.js";import{s as w}from"./StarredEntitiesApi-6SeILUA7.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-Cj9WRojc.js";import"./useIsomorphicLayoutEffect-CWw7s17H.js";import"./useAnalytics-CHRs9F0l.js";import"./useAsync-CtKW-R0u.js";import"./useMountedState-4spEAOpb.js";import"./componentData-Ck-liOWv.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CG8HQpK_.js";import"./useApp-c9Cmx9JK.js";import"./index-CxyDHaXg.js";import"./Plugin-uDhfna-s.js";import"./useRouteRef-_QxqMNzn.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-tzWnAsvT.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DcktFRiD.js";import"./Grid-BHnfM9BN.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./TextField-BE4yNrH2.js";import"./Select-psTXzcAQ.js";import"./index-DnL3XN75.js";import"./Popover-CBmXs0vj.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B8k-6ghs.js";import"./FormLabel-D_770mFO.js";import"./InputLabel-CuDSj0Lj.js";import"./ListItem-BxDrZyrD.js";import"./ListItemIcon-BFkyMXV-.js";import"./ListItemText-BE9Uflaf.js";import"./Remove-mN1xeAdo.js";import"./useCopyToClipboard-DyRiVU--.js";import"./Button-CJpRzj7y.js";import"./Divider-PYX69q2N.js";import"./FormControlLabel-DBV8ovMP.js";import"./Checkbox-BCXRv9zx.js";import"./SwitchBase-BC6VPVu3.js";import"./RadioGroup-BMA1yyVy.js";import"./MenuItem-D6E9BD6T.js";import"./translation-CeI4z23C.js";import"./DialogTitle-B91uUjY7.js";import"./Backdrop-khO5dm31.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D50i6r2J.js";import"./Edit-CQBFyOXn.js";import"./Cancel-RkG8WOFO.js";import"./Progress-OrcUOgr2.js";import"./LinearProgress-DBlH8prv.js";import"./ContentHeader-BIqatK4n.js";import"./Helmet-DZTe_dyH.js";import"./ErrorBoundary-Crn6Mezf.js";import"./ErrorPanel-B64V3zAe.js";import"./WarningPanel-C9caxC0h.js";import"./ExpandMore-B0SFV6c5.js";import"./AccordionDetails-B-VwfNtv.js";import"./Collapse-CIMX6SDT.js";import"./MarkdownContent-D1AHxM79.js";import"./CodeSnippet-CV4g9JLu.js";import"./CopyTextButton-DuiMHNoR.js";import"./LinkButton-DwUDlPmx.js";import"./Link-BCwjV0MZ.js";import"./useElementFilter-DuNyKDqx.js";import"./InfoCard-Dl82Ld7M.js";import"./CardContent-DSCKd1_n.js";import"./CardHeader-YOBkbVrI.js";import"./CardActions-C0mZmhjb.js";import"./BottomLink-CNa6Jzbq.js";import"./ArrowForward-B1fZSS8q.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  // This is the default configuration that is shown to the user
  // when first arriving to the homepage.
  const defaultConfig = [{
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 12,
    height: 5
  }, {
    component: 'HomePageRandomJoke',
    x: 0,
    y: 2,
    width: 6,
    height: 16
  }, {
    component: 'HomePageStarredEntities',
    x: 6,
    y: 2,
    width: 6,
    height: 12
  }];
  return <CustomHomepageGrid config={defaultConfig} rowHeight={10}>
      // Insert the allowed widgets inside the grid. User can add, organize and
      // remove the widgets as they want.
      <HomePageSearchBar />
      <HomePageRandomJoke />
      <HomePageStarredEntities />
    </CustomHomepageGrid>;
}`,...e.parameters?.docs?.source}}};const ae=["CustomizableTemplate"];export{e as CustomizableTemplate,ae as __namedExportsOrder,me as default};
