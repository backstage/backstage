import{j as t,T as i,c as m,C as a}from"./iframe-QksS9oll.js";import{w as n}from"./appWrappers-Cbugcrv7.js";import{s as p,H as s}from"./plugin-DaBVnQ4M.js";import{c as d}from"./api-2kzlNHsI.js";import{c}from"./catalogApiMock-BFbk-t-D.js";import{M as g}from"./MockStarredEntitiesApi-DAqYTPXZ.js";import{s as l}from"./api-CD1TnuNJ.js";import{C as h}from"./CustomHomepageGrid-CJfNNjYs.js";import{H as f,a as u}from"./plugin-cime2aoh.js";import{e as y}from"./routes-CEBAglxo.js";import{s as w}from"./StarredEntitiesApi-DrtcVWcH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-BEkg0zh2.js";import"./useIsomorphicLayoutEffect-DsxO7SBP.js";import"./useAnalytics-D3S6fnIb.js";import"./useAsync-DdMXChPX.js";import"./useMountedState-DqrcsGZ8.js";import"./componentData-CRWc3Ue1.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-esiVI4gD.js";import"./useApp-CB9Zi9mM.js";import"./index-BRpTdJ9c.js";import"./Plugin-TdwU8h6j.js";import"./useRouteRef-CZboVwVy.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-CU17qZMF.js";import"./Grid-D7XFfWKi.js";import"./Box-4mwxRbT8.js";import"./styled-Dz3wLS-L.js";import"./TextField-DySARS00.js";import"./Select-BckGqAPz.js";import"./index-B9sM2jn7.js";import"./Popover-D8Mf3ffv.js";import"./Modal-BVik2DkJ.js";import"./Portal-DNcXKhCz.js";import"./List-BifWF3Ny.js";import"./ListContext-BPnrPY1o.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C1ai1oD2.js";import"./FormLabel--J-vZWgN.js";import"./InputLabel-C3VXmI13.js";import"./ListItem-CjzOJyc8.js";import"./ListItemIcon-G0c4vyGi.js";import"./ListItemText-DdfK1hjm.js";import"./Remove-Hyg1BLqv.js";import"./useCopyToClipboard-B1WVdUm6.js";import"./Button-Dfimf7ZU.js";import"./Divider-C2MLF46q.js";import"./FormControlLabel-BMIRmM5D.js";import"./Checkbox-eynxIJ-5.js";import"./SwitchBase-Bd0rpPKc.js";import"./RadioGroup-CYuPAXlX.js";import"./MenuItem-DLZ-n9sp.js";import"./translation-DGukgLK5.js";import"./DialogTitle-CMD6ovcq.js";import"./Backdrop-D-shBcLD.js";import"./Tooltip-DBYgA5-n.js";import"./Popper-BcJim0Sm.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-zf8_Xt93.js";import"./Edit-CPXUUDGx.js";import"./Cancel-LS-u1Glt.js";import"./Progress-DjNQqjl8.js";import"./LinearProgress-2WUaicIm.js";import"./ContentHeader-5JvGwzpw.js";import"./Helmet-Dt_fvfAA.js";import"./ErrorBoundary-DXuXgUlr.js";import"./ErrorPanel-_1DH6jIy.js";import"./WarningPanel-D9lI_etd.js";import"./ExpandMore-BvW0rUjO.js";import"./AccordionDetails-DsDHdK5k.js";import"./Collapse-BhNoWWNo.js";import"./MarkdownContent-D_MwY5Q0.js";import"./CodeSnippet-NS8GLkfk.js";import"./CopyTextButton-CkYKd75j.js";import"./LinkButton-DzZbKr17.js";import"./Link-vv3H9C9T.js";import"./useElementFilter-BFKO0v6C.js";import"./InfoCard-BwrMRdCa.js";import"./CardContent-B-_Sxb8f.js";import"./CardHeader-B0eVnrW4.js";import"./CardActions-DAsWgPAr.js";import"./BottomLink-8s-33zJ-.js";import"./ArrowForward-DFKd6RHK.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
