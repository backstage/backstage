import{j as t,T as i,c as m,C as a}from"./iframe-BUNFJ-LL.js";import{w as n}from"./appWrappers-DwaX-D8B.js";import{s as p,H as s}from"./plugin-yKDzvPLF.js";import{c as d}from"./api-CmQYqdS2.js";import{c}from"./catalogApiMock-D-xX33M3.js";import{M as g}from"./MockStarredEntitiesApi-Baz5WbBl.js";import{s as l}from"./api-BMyYV67s.js";import{C as h}from"./CustomHomepageGrid-De_2u0C5.js";import{H as f,a as u}from"./plugin-DfsIxsAq.js";import{e as y}from"./routes-8FNQv1Et.js";import{s as w}from"./StarredEntitiesApi-wbxkwSDc.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./useAnalytics-BrGJTKfU.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./componentData-zDZJvmdk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-SSMRT9Bs.js";import"./useApp-DBsIRrNl.js";import"./index-BeHd8hJO.js";import"./Plugin-CX2F1Eyu.js";import"./useRouteRef-DmkHHcok.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-BSpTyRx6.js";import"./Grid-DBxLs0pG.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./TextField-BJq2ASY5.js";import"./Select-BkWY0oDV.js";import"./index-B9sM2jn7.js";import"./Popover-Dheh4pDu.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DqfIa0Dm.js";import"./FormLabel-C_IRPNph.js";import"./InputLabel-CiiZN-sU.js";import"./ListItem-DqtCuPtR.js";import"./ListItemIcon-BaVzYsIK.js";import"./ListItemText-Csz7vtMz.js";import"./Remove-BdX9oX9p.js";import"./useCopyToClipboard-TXjlrrXP.js";import"./Button-D5VZkG9s.js";import"./Divider-CRo1EOKz.js";import"./FormControlLabel-DR-QZbv-.js";import"./Checkbox-C0shAQFP.js";import"./SwitchBase-DfQIqOIj.js";import"./RadioGroup-DGVnBjT8.js";import"./MenuItem-D5tZwe5H.js";import"./translation-CUomELWS.js";import"./DialogTitle-hXdjHSFc.js";import"./Backdrop-BXminUHH.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CLUtenjB.js";import"./Edit-BIXomE85.js";import"./Cancel-D8_NegHV.js";import"./Progress-CW5gtCt2.js";import"./LinearProgress-CcYx_mjo.js";import"./ContentHeader-D7XR2w1W.js";import"./Helmet-Dvy4DeqH.js";import"./ErrorBoundary-D8c7Pies.js";import"./ErrorPanel-B1RREPgC.js";import"./WarningPanel-Ba3usJjp.js";import"./ExpandMore-BvmDc48x.js";import"./AccordionDetails-NEVFuKGX.js";import"./Collapse-oWd9G09k.js";import"./MarkdownContent-Baqdegrk.js";import"./CodeSnippet-BIdXEEly.js";import"./CopyTextButton-Do76HFgY.js";import"./LinkButton-k4dDLleo.js";import"./Link-9uhrDkOF.js";import"./useElementFilter-ld2ah69M.js";import"./InfoCard-OqQGZWM2.js";import"./CardContent-CxGOKSZj.js";import"./CardHeader-CfmBdIWt.js";import"./CardActions-BfUIEmfS.js";import"./BottomLink-BlsmOo41.js";import"./ArrowForward-d_wnYzhM.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const oe=["CustomizableTemplate"];export{e as CustomizableTemplate,oe as __namedExportsOrder,ee as default};
