import{j as t,T as i,c as m,C as a}from"./iframe-BOS9XsSt.js";import{w as n}from"./appWrappers-Bmoaw7n3.js";import{s as p,H as s}from"./plugin-DSJnjIU4.js";import{c as d}from"./api--dsHPIxc.js";import{c}from"./catalogApiMock-D3mbj07r.js";import{M as g}from"./MockStarredEntitiesApi-B4yqb_16.js";import{s as l}from"./api-D2Yypy4C.js";import{C as h}from"./CustomHomepageGrid-DNXAZ6Wd.js";import{H as f,a as u}from"./plugin-wCQqv6mY.js";import{e as y}from"./routes-BiSGuQZv.js";import{s as w}from"./StarredEntitiesApi-CROn8SY-.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useAsync-DzexZZOZ.js";import"./useMountedState-DaLgI8Ua.js";import"./componentData-5CzPqeYQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BYPtPQ_E.js";import"./useApp-D9_f5DFp.js";import"./index-CcT_T83P.js";import"./Plugin-BLgAY6cH.js";import"./useRouteRef-D6pX7G_I.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-DTLQ1FTD.js";import"./Grid-DpJzwvsy.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./TextField-DNnoNFHw.js";import"./Select-Bs2zu9h_.js";import"./index-B9sM2jn7.js";import"./Popover-BY21PHC9.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DTI40LvL.js";import"./FormLabel-BymGJfAb.js";import"./InputLabel--kTvBMSr.js";import"./ListItem-D4jOCDNX.js";import"./ListItemIcon-hu1kjzm-.js";import"./ListItemText-BRz_C0D5.js";import"./Remove-DUWFcAtH.js";import"./useCopyToClipboard-hUj9jZ5o.js";import"./Button-D34xgd1Q.js";import"./Divider-CxQHAU7C.js";import"./FormControlLabel-Bz33dyZ1.js";import"./Checkbox-C9UxbVdx.js";import"./SwitchBase-Dw2VgZAc.js";import"./RadioGroup-DQ73tDGG.js";import"./MenuItem-Dj-IQX4x.js";import"./translation-BmlN5FLu.js";import"./DialogTitle-DX7hGYAC.js";import"./Backdrop-CpYmoctA.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CY47KMwg.js";import"./Edit-DzG3jRQ0.js";import"./Cancel-CoDCt5Sv.js";import"./Progress-DaWEFwns.js";import"./LinearProgress-j0on-w1A.js";import"./ContentHeader-CEqhxZR5.js";import"./Helmet-BUBAZPhm.js";import"./ErrorBoundary-Biou5a7y.js";import"./ErrorPanel-DvbxkBY0.js";import"./WarningPanel-DBRwILC2.js";import"./ExpandMore-DPjiSkKA.js";import"./AccordionDetails-CY60n5OB.js";import"./Collapse-CD_ND2rt.js";import"./MarkdownContent-BPIFlL-y.js";import"./CodeSnippet-CVmjwtmC.js";import"./CopyTextButton-Bp4E28TJ.js";import"./LinkButton-Cfhz45Fp.js";import"./Link-B09CKdbR.js";import"./useElementFilter-Bvvntj7Y.js";import"./InfoCard-fL2e7Fb-.js";import"./CardContent-BiZP4o13.js";import"./CardHeader-CW0rLmly.js";import"./CardActions-DzUljMxl.js";import"./BottomLink-uXx83WET.js";import"./ArrowForward-DrsDRv_i.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
