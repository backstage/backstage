import{j as t,T as i,c as m,C as a}from"./iframe-B07WZXM3.js";import{w as n}from"./appWrappers-CY9OeE-D.js";import{s as p,H as s}from"./plugin-bQkFmPGq.js";import{c as d}from"./api-DI0yvp5j.js";import{c}from"./catalogApiMock-C_CMiumw.js";import{M as g}from"./MockStarredEntitiesApi-CWGjzr_c.js";import{s as l}from"./api-B64UmXKD.js";import{C as h}from"./CustomHomepageGrid-CDygS6Cc.js";import{H as f,a as u}from"./plugin-Cky38OIy.js";import{e as y}from"./routes-Pvp219n7.js";import{s as w}from"./StarredEntitiesApi-KlmEdHwv.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./useAnalytics-CVMEzOss.js";import"./useAsync-DCstABRD.js";import"./useMountedState-BHHklG7n.js";import"./componentData-DQzB6vVe.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BxkUEN8z.js";import"./useApp-K3As38vi.js";import"./index-D2gGq-iW.js";import"./Plugin-CZOVJjYF.js";import"./useRouteRef-YqSqr-8_.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BOjw6Gkn.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DZ5ZW9uK.js";import"./Grid-BY5Lob_Q.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./TextField-5kDh-taJ.js";import"./Select-BdNrLbz5.js";import"./index-DnL3XN75.js";import"./Popover-BvP6HXT7.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D_ymLlMo.js";import"./FormLabel-BaWB6GXZ.js";import"./InputLabel-CWKzW2YU.js";import"./ListItem-CbK_QR24.js";import"./ListItemIcon-CsMLWt_q.js";import"./ListItemText-BnYxYQrd.js";import"./Remove-DTAh61kF.js";import"./useCopyToClipboard-2MhLRliJ.js";import"./Button-CyuaBLDC.js";import"./Divider-MyjmiSrT.js";import"./FormControlLabel-CZbWldYe.js";import"./Checkbox-DxMSedF6.js";import"./SwitchBase-CK2b8vb-.js";import"./RadioGroup-CJBhBTr_.js";import"./MenuItem-CkSkG-Fe.js";import"./translation-Nl7jllm3.js";import"./DialogTitle-D75WnviF.js";import"./Backdrop-BhjMJ7cT.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CdJkAB3w.js";import"./Edit-CUjRphWr.js";import"./Cancel-BEvISVns.js";import"./Progress-zWsf7NZE.js";import"./LinearProgress-CFE57kjP.js";import"./ContentHeader-BJJtb-Ce.js";import"./Helmet-C7gnyS-b.js";import"./ErrorBoundary-C0cY3uRo.js";import"./ErrorPanel-ayETAGhj.js";import"./WarningPanel-DImNnyuV.js";import"./ExpandMore-Da5XW09b.js";import"./AccordionDetails-B-vBZmTY.js";import"./Collapse-Bc-VFX1u.js";import"./MarkdownContent-CcNYv7l1.js";import"./CodeSnippet-BxcFip7J.js";import"./CopyTextButton-xE5t_wDk.js";import"./LinkButton-C9NGk5Cj.js";import"./Link-BSdi_-Cv.js";import"./useElementFilter-Dc8BtzOg.js";import"./InfoCard-F0p-l5uK.js";import"./CardContent-Di1P8Mmg.js";import"./CardHeader-D4MCyAu5.js";import"./CardActions-DK9Pnp_M.js";import"./BottomLink-DRJDK7sA.js";import"./ArrowForward-C1CbMcYH.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
