import{j as t,T as i,c as m,C as a}from"./iframe-CJzL4cPn.js";import{w as n}from"./appWrappers-t7jUGClR.js";import{s as p,H as s}from"./plugin-D2nWyMkh.js";import{c as d}from"./api-DGE4Qh0m.js";import{c}from"./catalogApiMock-BDZRCWBF.js";import{M as g}from"./MockStarredEntitiesApi-DV45ZQ4j.js";import{s as l}from"./api-D6FmelBo.js";import{C as h}from"./CustomHomepageGrid-Crv9sefK.js";import{H as f,a as u}from"./plugin-Bw2JxBRJ.js";import{e as y}from"./routes-Cq1zNHUw.js";import{s as w}from"./StarredEntitiesApi-CKm3IY79.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./useAnalytics-BPOXrxOI.js";import"./useAsync-BSNRfxTI.js";import"./useMountedState-B45YxSq3.js";import"./componentData-Bxo0opjl.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DOHES8EM.js";import"./useApp-B-72fomi.js";import"./index-CzvWtn5D.js";import"./Plugin-T9LhbTpw.js";import"./useRouteRef-C2SQIqLl.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CpePvc9k.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-6rAqLNru.js";import"./Grid-BQVDj5Jb.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./TextField-B7gLx0sy.js";import"./Select-DIPzd_nu.js";import"./index-DnL3XN75.js";import"./Popover-DfyH4ojT.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Di4nVdks.js";import"./FormLabel-BdJVzTF4.js";import"./InputLabel-Dsdf4i3I.js";import"./ListItem-KhwlQec0.js";import"./ListItemIcon-CTSQ3CDI.js";import"./ListItemText-B_NH5e14.js";import"./Remove-wPemdTQ_.js";import"./useCopyToClipboard-PlMsdEl8.js";import"./Button-BDjrXKRV.js";import"./Divider-BE8z6uet.js";import"./FormControlLabel-W8Q8fZmY.js";import"./Checkbox-QPl8g3l_.js";import"./SwitchBase-D-iCpS1h.js";import"./RadioGroup-CH4-WRj1.js";import"./MenuItem-B_k5kJ9V.js";import"./translation-DzN0115r.js";import"./DialogTitle-CVZcsTa6.js";import"./Backdrop-gfzpOR42.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-4_UFIi2U.js";import"./Edit-02OSItRD.js";import"./Cancel-Canqxtcs.js";import"./Progress-BKjRG_zv.js";import"./LinearProgress-BtqyN3Ir.js";import"./ContentHeader-7Sh70727.js";import"./Helmet-lGd-aPuq.js";import"./ErrorBoundary-DBk-iV9m.js";import"./ErrorPanel-GfXZ_B1c.js";import"./WarningPanel-BI6WRQPV.js";import"./ExpandMore-CmjptgVe.js";import"./AccordionDetails-BotIVLWW.js";import"./Collapse-DsMTKxQW.js";import"./MarkdownContent-C8HtueuI.js";import"./CodeSnippet-CXtB-eI-.js";import"./CopyTextButton-CsNMp3PI.js";import"./LinkButton-UtNdPjxK.js";import"./Link-bUQVVVBw.js";import"./useElementFilter-C2V4XNZa.js";import"./InfoCard-s6oTMLKo.js";import"./CardContent-dYVvKObS.js";import"./CardHeader-CmXARScs.js";import"./CardActions-DiO9K5sf.js";import"./BottomLink-BModPU04.js";import"./ArrowForward-Z4Kc94IP.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
