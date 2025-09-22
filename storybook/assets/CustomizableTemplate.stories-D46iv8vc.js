import{j as t,T as i,c as m,C as a}from"./iframe-BKfEGE7G.js";import{w as n}from"./appWrappers-BhL0UeRU.js";import{s as p,H as s}from"./plugin-_OgSNOg9.js";import{c as d}from"./api-Cnqdhpah.js";import{c}from"./catalogApiMock-B-jNwWNd.js";import{M as g}from"./MockStarredEntitiesApi-DzgMxpzK.js";import{s as l}from"./api-DhH7lEZ9.js";import{C as h}from"./CustomHomepageGrid-UZO6D6zI.js";import{H as f,a as u}from"./plugin-BOqA5qbY.js";import{e as y}from"./routes-CJg4wSe3.js";import{s as w}from"./StarredEntitiesApi-DIe1XrPq.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-1flBwXTR.js";import"./useAnalytics-BLOfhO-l.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./componentData-MugjuQjt.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DxVjIFhW.js";import"./useApp-_11zMdcF.js";import"./index-Dwj1Q-YF.js";import"./Plugin-CmKCshsM.js";import"./useRouteRef-B__3vLRT.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-Cxthp_Mr.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DOQmH4dQ.js";import"./Grid-vX9qBbX0.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./TextField-GrIBMvZl.js";import"./Select-HjZKhiCT.js";import"./index-DnL3XN75.js";import"./Popover-BDMv4xbF.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DkGOq8F2.js";import"./FormLabel-rWNDR_CN.js";import"./InputLabel-Cewi00W0.js";import"./ListItem-DH54cTxL.js";import"./ListItemIcon-CGMSEMC9.js";import"./ListItemText-DfnmZGrz.js";import"./Remove-DLqXwkmh.js";import"./useCopyToClipboard-By-88AN1.js";import"./Button-CBt-BxVf.js";import"./Divider-B7pMmKOl.js";import"./FormControlLabel-3PKAlnIs.js";import"./Checkbox-CgKQJ5Kl.js";import"./SwitchBase-B153thNd.js";import"./RadioGroup-DY8AY5HH.js";import"./MenuItem-DU6GWwGa.js";import"./translation-D5uPeIJF.js";import"./DialogTitle-COtGSIrZ.js";import"./Backdrop-TvGNQn7O.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DLQfyFjg.js";import"./Edit-DTNLlZ9b.js";import"./Cancel-DkRsd8Pp.js";import"./Progress-CXYpQq4U.js";import"./LinearProgress-ONnmqoew.js";import"./ContentHeader-CsuWPSzS.js";import"./Helmet-BTYN8qmy.js";import"./ErrorBoundary-DggD4pwq.js";import"./ErrorPanel-D0Z-D0YB.js";import"./WarningPanel-BmLRnDjl.js";import"./ExpandMore-Bf4tz0ks.js";import"./AccordionDetails-DO5qN2es.js";import"./Collapse-Bj6_bX8n.js";import"./MarkdownContent-BbcMZHtE.js";import"./CodeSnippet-4N0YB7qg.js";import"./CopyTextButton-_rHychZO.js";import"./LinkButton-Dp8nvFiv.js";import"./Link-CDMP9pev.js";import"./useElementFilter-Demb5eSc.js";import"./InfoCard-BPOeB8Dc.js";import"./CardContent-DrXXBE5X.js";import"./CardHeader-pOr2jc7f.js";import"./CardActions-D1j0vYEk.js";import"./BottomLink-DpbJPqBE.js";import"./ArrowForward-BWmuSl5e.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
