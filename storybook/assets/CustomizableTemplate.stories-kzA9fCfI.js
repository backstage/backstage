import{j as t,T as i,c as m,C as a}from"./iframe-C8yOC2Gz.js";import{w as n}from"./appWrappers-BwqhmqR7.js";import{s as p,H as s}from"./plugin-CqVHvhmx.js";import{c as d}from"./api-DOZG5ASV.js";import{c}from"./catalogApiMock-B58o2YmA.js";import{M as g}from"./MockStarredEntitiesApi-73icKMgX.js";import{s as l}from"./api-DzvCKpP9.js";import{C as h}from"./CustomHomepageGrid-B320_V-7.js";import{H as f,a as u}from"./plugin-C5Nls2ei.js";import{e as y}from"./routes-CiSCKseB.js";import{s as w}from"./StarredEntitiesApi-okwhi8r8.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-4Q7GBTuk.js";import"./useIsomorphicLayoutEffect-9KuYP6zf.js";import"./useAnalytics-CGjIDoIa.js";import"./useAsync-A762jT4V.js";import"./useMountedState-Bkd0wkwf.js";import"./componentData-BzMhRHzP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CL1m9NR9.js";import"./useApp-_O_9FYmx.js";import"./index-kU3y7djL.js";import"./Plugin-BKrfKbSW.js";import"./useRouteRef-Csph2kF6.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-CaRqwocm.js";import"./Grid-CFxNiZTj.js";import"./Box-CBcWlLgQ.js";import"./styled-Ci681tPu.js";import"./TextField-DMfogsQu.js";import"./Select-CBdak2wN.js";import"./index-B9sM2jn7.js";import"./Popover-BRQt0jP-.js";import"./Modal-D0M0Hit_.js";import"./Portal-CjckT897.js";import"./List-BjKqLdFh.js";import"./ListContext-6MZEPlz1.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CkAWgfq3.js";import"./FormLabel-BeCjxGFS.js";import"./InputLabel-CMoh8hhc.js";import"./ListItem-BMFOx_2Q.js";import"./ListItemIcon-8Z3vHIwy.js";import"./ListItemText-CyJt0pMj.js";import"./Remove-B8XFTOlC.js";import"./useCopyToClipboard-Cdth3J8w.js";import"./Button-BKAaE2BP.js";import"./Divider-9e41O7nq.js";import"./FormControlLabel-DPOZgmg6.js";import"./Checkbox-C7d2Re-i.js";import"./SwitchBase-DCsA1uJZ.js";import"./RadioGroup-DrSSnMZP.js";import"./MenuItem-BKUhuMxW.js";import"./translation-ijSKanRE.js";import"./DialogTitle-BkYEluNi.js";import"./Backdrop-CgVSzXAJ.js";import"./Tooltip-BmRm86HZ.js";import"./Popper-DqIt_wBv.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BdyFd4Qa.js";import"./Edit-Bd9HAF79.js";import"./Cancel-BlXCJ8P9.js";import"./Progress-B8gfTFQ4.js";import"./LinearProgress-CzRNej5f.js";import"./ContentHeader-CfnmIVpi.js";import"./Helmet-CfXlE53z.js";import"./ErrorBoundary-BZIgoJeC.js";import"./ErrorPanel-C1UVhDOE.js";import"./WarningPanel-k1eYB_NT.js";import"./ExpandMore-DevN-S2O.js";import"./AccordionDetails-ClHZ_AqU.js";import"./Collapse-BMBJHt31.js";import"./MarkdownContent-C9TrxeVt.js";import"./CodeSnippet-CcjaZ8oG.js";import"./CopyTextButton-BJf8FGQ0.js";import"./LinkButton-B4FRoGfy.js";import"./Link-CUs49TGY.js";import"./useElementFilter-BoiJjVFw.js";import"./InfoCard-NdZuYaRN.js";import"./CardContent-BTwSHN8c.js";import"./CardHeader-CK7GWSaa.js";import"./CardActions-DjE-ZFS5.js";import"./BottomLink-hnT-aCrJ.js";import"./ArrowForward-CyzdqpLN.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
