import{j as t,T as i,c as m,C as a}from"./iframe-PR9K1gR4.js";import{w as n}from"./appWrappers-DEOTEiR9.js";import{s as p,H as s}from"./plugin-CFnafnlx.js";import{c as d}from"./api-DaUZEnG5.js";import{c}from"./catalogApiMock-BTbc8GwO.js";import{M as g}from"./MockStarredEntitiesApi-Cml1lY6H.js";import{s as l}from"./api-D5cPBjSE.js";import{C as h}from"./CustomHomepageGrid-DO01sB5E.js";import{H as f,a as u}from"./plugin-CJzI0Twe.js";import{e as y}from"./routes-ylAyRNee.js";import{s as w}from"./StarredEntitiesApi-Q4vuWb4K.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BhXF4yMN.js";import"./useAnalytics-D2YlE8CY.js";import"./useAsync-CdCMGCNf.js";import"./useMountedState-9lLipg6w.js";import"./componentData-o86LZs6r.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-qP2Hr3Qu.js";import"./useApp-BW5Yca7D.js";import"./index-Cmq8aGIJ.js";import"./Plugin-DNmMI31j.js";import"./useRouteRef-B521NRec.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BDAW8T_G.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DnCn513I.js";import"./Grid-BDCj0xnW.js";import"./Box-DE3El2Us.js";import"./styled-BWfK9xAq.js";import"./TextField-NCGKTwtT.js";import"./Select-CCKModBu.js";import"./index-DnL3XN75.js";import"./Popover-BP65aWRb.js";import"./Modal-DgU04yZ2.js";import"./Portal-CHANQNTr.js";import"./List-9O5jesKH.js";import"./ListContext-d9I9drbR.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CNqdG48A.js";import"./FormLabel-BNpfmOSH.js";import"./InputLabel-B2OeJ7wX.js";import"./ListItem-BSmKrE7c.js";import"./ListItemIcon-DPKAOxsE.js";import"./ListItemText-BDaGpWdO.js";import"./Remove-2gwjA0ob.js";import"./useCopyToClipboard-Dv8Ke7sP.js";import"./Button-DAulvpLo.js";import"./Divider-C49XG7LX.js";import"./FormControlLabel-DUc7FJR-.js";import"./Checkbox-scMIVqBj.js";import"./SwitchBase-ChdSqEBb.js";import"./RadioGroup-DEinMgT2.js";import"./MenuItem-Cs-G5Cbc.js";import"./translation-BvnVVzF5.js";import"./DialogTitle-B59kuhfC.js";import"./Backdrop-B3ZiF5N6.js";import"./Tooltip-NKLLE1oV.js";import"./Popper-C2P8lryL.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D7sKW8E-.js";import"./Edit-B01PIC8x.js";import"./Cancel-D2fVUxG6.js";import"./Progress-CKjAnVha.js";import"./LinearProgress-DmDEYB5n.js";import"./ContentHeader-0BYCHjNv.js";import"./Helmet-BknictYz.js";import"./ErrorBoundary-Cp4UMxdi.js";import"./ErrorPanel-wKrI7pp5.js";import"./WarningPanel-BdWxPo3h.js";import"./ExpandMore-C65eZJGL.js";import"./AccordionDetails-C_jBxEzP.js";import"./Collapse-B00qmsYa.js";import"./MarkdownContent-CPx5kcko.js";import"./CodeSnippet-BcyQuG45.js";import"./CopyTextButton-EKDV7SOv.js";import"./LinkButton-DfUc1wjm.js";import"./Link-8mF5gqTh.js";import"./useElementFilter-Cq7443pA.js";import"./InfoCard-BsnUWDGu.js";import"./CardContent-D7oLkQ_y.js";import"./CardHeader-BkJyBP81.js";import"./CardActions-BBsiP_-o.js";import"./BottomLink-D_BnnSpC.js";import"./ArrowForward-B-qxFdBl.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const me=["CustomizableTemplate"];export{e as CustomizableTemplate,me as __namedExportsOrder,ie as default};
