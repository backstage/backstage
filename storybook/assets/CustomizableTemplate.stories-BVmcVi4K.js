import{j as t,T as i,c as m,C as a}from"./iframe-DGs96NRX.js";import{w as n}from"./appWrappers-Dk3b9LWk.js";import{s as p,H as s}from"./plugin-DH34O9We.js";import{c as d}from"./api-DofS2hSP.js";import{c}from"./catalogApiMock-Dv3PCQRb.js";import{M as g}from"./MockStarredEntitiesApi-DlfjBlEv.js";import{s as l}from"./api-CANwXgMk.js";import{C as h}from"./CustomHomepageGrid-B8lIJ5Fd.js";import{H as f,a as u}from"./plugin-DhChxGdP.js";import{e as y}from"./routes-CQY1Cei1.js";import{s as w}from"./StarredEntitiesApi-BZeWdTsg.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DHsdD1qc.js";import"./useIsomorphicLayoutEffect-CVR0SjCS.js";import"./useAnalytics-Dn6o1gMJ.js";import"./useAsync-Bl5kKHyn.js";import"./useMountedState-CrWRPmTB.js";import"./componentData-DWCQSrQj.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-Du2IYsJS.js";import"./useApp-Sx5G5NdM.js";import"./index-CWyzElHM.js";import"./Plugin-D2IBlZ3_.js";import"./useRouteRef-XG42dmXR.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DF1fgo-m.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BVjoXk_q.js";import"./Grid-BHZNDkgf.js";import"./Box-D4WzEFhv.js";import"./styled-BpF5KOwn.js";import"./TextField-DbQomu9p.js";import"./Select-Dtv3Xfot.js";import"./index-DnL3XN75.js";import"./Popover-Cyvu5YOR.js";import"./Modal-BddTY979.js";import"./Portal-d4IyiHDj.js";import"./List-6sBN0fEc.js";import"./ListContext-JUKi6eaD.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BWzqBC8C.js";import"./FormLabel-DsqQygb-.js";import"./InputLabel-euruMf4a.js";import"./ListItem-B6WkBU7i.js";import"./ListItemIcon-CcQx7ihv.js";import"./ListItemText-DKlzuA8v.js";import"./Remove-CKgf-M2Z.js";import"./useCopyToClipboard-CMVqWLvJ.js";import"./Button-Nle0L9Fl.js";import"./Divider-D5eOEnUc.js";import"./FormControlLabel-lEL3bB3y.js";import"./Checkbox-B4cMNjF1.js";import"./SwitchBase-BQ_cAT6J.js";import"./RadioGroup-CrmxeGsO.js";import"./MenuItem-D1l_ume9.js";import"./translation-CMRhU-37.js";import"./DialogTitle-BKLIXxRc.js";import"./Backdrop-DikSmCJp.js";import"./Tooltip-B0esBOhK.js";import"./Popper-O4AAWfmZ.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-ADYvyv_v.js";import"./Edit-DguwumAm.js";import"./Cancel-DOcoroa0.js";import"./Progress-G8J7q6j9.js";import"./LinearProgress-tPe4r5gr.js";import"./ContentHeader-DNq4Qs4z.js";import"./Helmet-1QbTQATo.js";import"./ErrorBoundary-Dc-3W-6w.js";import"./ErrorPanel-CNmGi6XN.js";import"./WarningPanel-Ci1uty-p.js";import"./ExpandMore-sv7y42DS.js";import"./AccordionDetails-DcDYdNfQ.js";import"./Collapse-B15AMTul.js";import"./MarkdownContent-BL9CdgAN.js";import"./CodeSnippet-_eOoFouG.js";import"./CopyTextButton-BnG0iIPf.js";import"./LinkButton-IIcYw6pZ.js";import"./Link-GHtCGRiO.js";import"./useElementFilter-YIzP_I7o.js";import"./InfoCard-CVq5vFZI.js";import"./CardContent-D_Z8OSfu.js";import"./CardHeader-DEMtBZ-P.js";import"./CardActions-BH_5asRW.js";import"./BottomLink-V5hYwYd7.js";import"./ArrowForward-D58oRGFf.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
