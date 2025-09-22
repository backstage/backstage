import{j as t,T as i,c as m,C as a}from"./iframe-hvh2aMf9.js";import{w as n}from"./appWrappers-Br-zmgYb.js";import{s as p,H as s}from"./plugin-D64ROlJ2.js";import{c as d}from"./api-udXRlEcK.js";import{c}from"./catalogApiMock-Cx-QJvKV.js";import{M as g}from"./MockStarredEntitiesApi-PT64XYSq.js";import{s as l}from"./api-BNBMsT4i.js";import{C as h}from"./CustomHomepageGrid-CoHW4nBJ.js";import{H as f,a as u}from"./plugin-DBTSfPRA.js";import{e as y}from"./routes-B1khMf0X.js";import{s as w}from"./StarredEntitiesApi-CR-zAbgF.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BBWREk27.js";import"./useIsomorphicLayoutEffect-BrJ5WAHL.js";import"./useAnalytics-CVphDHTH.js";import"./useAsync-DTXafnw5.js";import"./useMountedState-CuwT9qKs.js";import"./componentData-DJ30wAD0.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-7QU1_rFp.js";import"./useApp-CqXr_4Cz.js";import"./index-ChEhYZD7.js";import"./Plugin-BVqzn08d.js";import"./useRouteRef-CAeo51pw.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-U7KbeYXP.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DixBhMRG.js";import"./Grid-DbJ44Ewx.js";import"./Box-BjIjXY28.js";import"./styled-CsVOCgfV.js";import"./TextField-DCGZEAm-.js";import"./Select-C81yUSPF.js";import"./index-DnL3XN75.js";import"./Popover-DO-qvFaR.js";import"./Modal-D7enm8Ov.js";import"./Portal-Bb9zcDOK.js";import"./List-74W1l74F.js";import"./ListContext-DMJfGJuk.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BR5gSDSV.js";import"./FormLabel-Dbp9-9jn.js";import"./InputLabel-DpPc-Cth.js";import"./ListItem-CXtueEiL.js";import"./ListItemIcon-Cu_92qKe.js";import"./ListItemText-Cnvrb4zg.js";import"./Remove-B_AVc6tA.js";import"./useCopyToClipboard-D9VM6fel.js";import"./Button-DCfJTuUb.js";import"./Divider-D1DdZhOv.js";import"./FormControlLabel-BlxkZIs9.js";import"./Checkbox-kONtCat5.js";import"./SwitchBase-MdywNRF2.js";import"./RadioGroup-D8Vcc485.js";import"./MenuItem-bpLkcWO4.js";import"./translation-C-oJnvEs.js";import"./DialogTitle-GCc4cGcE.js";import"./Backdrop-B_m0crbj.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CFVo4kEf.js";import"./Edit-DdAVnbLr.js";import"./Cancel-CAJVlFv0.js";import"./Progress-xUG6Wg7g.js";import"./LinearProgress-cUA0lW5M.js";import"./ContentHeader-B5p-rYZL.js";import"./Helmet-DC2ih9mo.js";import"./ErrorBoundary-Dh8qKDOl.js";import"./ErrorPanel-DykIF4Ux.js";import"./WarningPanel-CJ_nUs4N.js";import"./ExpandMore-nelLsYHb.js";import"./AccordionDetails-DLZ6dsCT.js";import"./Collapse-PeWKU6hc.js";import"./MarkdownContent-DCK-3Ric.js";import"./CodeSnippet-5nQo7gNl.js";import"./CopyTextButton-FOvJ_Vam.js";import"./LinkButton-CbQ3iKUC.js";import"./Link-CHVET8I2.js";import"./useElementFilter-B5SxWpWz.js";import"./InfoCard-C848hzjp.js";import"./CardContent-DN23BuSy.js";import"./CardHeader-CuySZ8Hj.js";import"./CardActions-DuulD9pz.js";import"./BottomLink-Svs5ms_-.js";import"./ArrowForward-DlduA0Ms.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
