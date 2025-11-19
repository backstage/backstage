import{j as t,T as i,c as m,C as a}from"./iframe-C4dPZ8kl.js";import{w as n}from"./appWrappers-7vg0hiAv.js";import{s as p,H as s}from"./plugin-CGA0-Gio.js";import{c as d}from"./api-DSZgFeXT.js";import{c}from"./catalogApiMock-DiOnkf_q.js";import{M as g}from"./MockStarredEntitiesApi-D3gctBm5.js";import{s as l}from"./api-CEECTQzO.js";import{C as h}from"./CustomHomepageGrid-uzddNPe-.js";import{H as f,a as u}from"./plugin-DyYk1xMB.js";import{e as y}from"./routes-CVHATU2K.js";import{s as w}from"./StarredEntitiesApi-Cp-Fvog6.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-ucvHRIwK.js";import"./useIsomorphicLayoutEffect-DxvvdXSg.js";import"./useAnalytics-DSRHfRk8.js";import"./useAsync-DoJxcUlb.js";import"./useMountedState-Cn7zfAE-.js";import"./componentData-DMZccOUa.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-D_dzg66M.js";import"./useApp-DcP6b98f.js";import"./index-pWMmScx5.js";import"./Plugin-CK7oqw3K.js";import"./useRouteRef-BQcipW1o.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-MZ7iTJ6L.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DKGzY6cO.js";import"./Grid-CZkThu2A.js";import"./Box-COTlPoNf.js";import"./styled-ie_8oXYP.js";import"./TextField-BHctqG4m.js";import"./Select-BOsKy5sc.js";import"./index-DnL3XN75.js";import"./Popover-Df7jUf51.js";import"./Modal-Ch6lvVax.js";import"./Portal-C3KrmcYH.js";import"./List-CsFCwjIb.js";import"./ListContext-CZ3AIdLK.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DvYJkUVt.js";import"./FormLabel-Bar7Y58t.js";import"./InputLabel-ChDn_NUO.js";import"./ListItem-Bx6LKxKb.js";import"./ListItemIcon-CYHp3Lm4.js";import"./ListItemText-BtakqwiJ.js";import"./Remove-Mzsb8vjO.js";import"./useCopyToClipboard-CFD3RXQw.js";import"./Button-Bagr9kg6.js";import"./Divider-BRNaSJ60.js";import"./FormControlLabel-ngeAMieV.js";import"./Checkbox-w2lt6xr1.js";import"./SwitchBase-NNbXJhN0.js";import"./RadioGroup-BU7y5rhg.js";import"./MenuItem-BAffiuvQ.js";import"./translation-B7d-maSk.js";import"./DialogTitle-B_WNMW88.js";import"./Backdrop-CYIUSPea.js";import"./Tooltip-BFnVM2Xk.js";import"./Popper-0_gUpV4D.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BOCpAB1y.js";import"./Edit-iypuVQ97.js";import"./Cancel-ID14v5pi.js";import"./Progress-DorQaiBD.js";import"./LinearProgress-C19pYEed.js";import"./ContentHeader-BCTnRXNb.js";import"./Helmet-DWReSuWO.js";import"./ErrorBoundary-CbSR2es8.js";import"./ErrorPanel-f98hRRjB.js";import"./WarningPanel-UrVVQWJv.js";import"./ExpandMore-DDjBqXKI.js";import"./AccordionDetails-Ce7Lmoz_.js";import"./Collapse-CJN8yhuQ.js";import"./MarkdownContent-DRc5DkYJ.js";import"./CodeSnippet-B1XiwaHz.js";import"./CopyTextButton-ENp4DaQL.js";import"./LinkButton-DQDnYx_t.js";import"./Link-qsu39Qum.js";import"./useElementFilter-mjxhcd2C.js";import"./InfoCard-fptdlUM7.js";import"./CardContent-BvLIKHM3.js";import"./CardHeader-dQebxsoQ.js";import"./CardActions-CqEpFnAU.js";import"./BottomLink-CPG2W-HG.js";import"./ArrowForward-nOblFUSu.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
