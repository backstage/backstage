import{j as t,T as i,c as m,C as a}from"./iframe-DKl1TaBY.js";import{w as n}from"./appWrappers-CQMFW9f8.js";import{s as p,H as s}from"./plugin-CNz7lisr.js";import{c as d}from"./api-DQyl4QJ5.js";import{c}from"./catalogApiMock-KGAmxi57.js";import{M as g}from"./MockStarredEntitiesApi-Thp0zSW6.js";import{s as l}from"./api-CzWMH9sB.js";import{C as h}from"./CustomHomepageGrid-C7YGpjnq.js";import{H as f,a as u}from"./plugin-ofVW4ekV.js";import{e as y}from"./routes-CXk1nUCX.js";import{s as w}from"./StarredEntitiesApi-BLZY5Rt8.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DEWsWzFy.js";import"./useIsomorphicLayoutEffect-5ZyPzn4u.js";import"./useAnalytics-CECp0-UO.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./componentData-C9VKpHEQ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CAizWZSO.js";import"./useApp-OM9z5S5N.js";import"./index-D3KAHFPL.js";import"./Plugin-Cp-tNdu1.js";import"./useRouteRef-CjGG19qw.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BkxLxh5T.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-Dz19o7aT.js";import"./Grid-DucnE1Qv.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./TextField-DAe5e78r.js";import"./Select-DQrTgl6q.js";import"./index-DnL3XN75.js";import"./Popover-CYX2rhOY.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-ivci966F.js";import"./FormLabel-BnQER_VI.js";import"./InputLabel-BD4uJDC-.js";import"./ListItem-Cik-ImzB.js";import"./ListItemIcon-ClgSqD8f.js";import"./ListItemText-X8gsxozg.js";import"./Remove-DbTZhRlT.js";import"./useCopyToClipboard-BgwPpn9s.js";import"./Button-ho9zTU_x.js";import"./Divider-DdBr9tFd.js";import"./FormControlLabel-DX2d5nw4.js";import"./Checkbox-bPCgQ04X.js";import"./SwitchBase-Dt7-H3SR.js";import"./RadioGroup-9qGZFoAP.js";import"./MenuItem-DFRTJYZD.js";import"./translation-CiuLBvZL.js";import"./DialogTitle-BfB3GFxp.js";import"./Backdrop-C6FYe0Ep.js";import"./Tooltip-73fNlhkg.js";import"./Popper-BCEz05NO.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CFNYinHa.js";import"./Edit-C6JbTE8E.js";import"./Cancel-BZP87Gr_.js";import"./Progress-BVLc_jom.js";import"./LinearProgress-DyuOcEX6.js";import"./ContentHeader-cssooWRC.js";import"./Helmet-C62OOZn8.js";import"./ErrorBoundary-pwMpy8Pl.js";import"./ErrorPanel-9AkQroOm.js";import"./WarningPanel-eVG4_neK.js";import"./ExpandMore-SNT8Gr9W.js";import"./AccordionDetails-5IM8yJG8.js";import"./Collapse-DRCUh2Je.js";import"./MarkdownContent-Cd_tUbb9.js";import"./CodeSnippet-CNnnJvIp.js";import"./CopyTextButton-TfPCFLIm.js";import"./LinkButton-Bm5eURQl.js";import"./Link-BtYWFjac.js";import"./useElementFilter-DQT3JP6-.js";import"./InfoCard-BXfocUJP.js";import"./CardContent-BnHsAJ1f.js";import"./CardHeader-CZMAOeHX.js";import"./CardActions-BFLytzP8.js";import"./BottomLink-BpjWpCp6.js";import"./ArrowForward-DvHRQMuG.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
