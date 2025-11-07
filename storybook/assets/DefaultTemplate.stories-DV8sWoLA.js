import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DqJQ9uPs.js";import{s as g,H as u}from"./plugin-GjKQLFY4.js";import{c as h}from"./api-DrvDFWyv.js";import{c as f}from"./catalogApiMock-DslU3kGG.js";import{s as x}from"./api-DFeRnRBI.js";import{S as y}from"./SearchContext-CDPFSwZ_.js";import{P as S}from"./Page-B5wwLJrk.js";import{S as r}from"./Grid-KKLALRV6.js";import{b as k,a as j,c as C}from"./plugin-BWMFMYkc.js";import{T as P}from"./TemplateBackstageLogo-EnCns9nV.js";import{T}from"./TemplateBackstageLogoIcon-ArrPH9_F.js";import{e as I}from"./routes-CAwiEPb-.js";import{w as v}from"./appWrappers-DvUcS6kA.js";import{s as G}from"./StarredEntitiesApi-DFSkVDxF.js";import{M as A}from"./MockStarredEntitiesApi-CzD4is9g.js";import{I as B}from"./InfoCard-DfVmKB2_.js";import"./preload-helper-D9Z9MdNV.js";import"./index-IonfJZQ1.js";import"./Plugin-DUvFkCSb.js";import"./componentData-9JsUC9W5.js";import"./useAnalytics-CfDtSbQu.js";import"./useApp-ByL28iDl.js";import"./useRouteRef-DZAPdgx2.js";import"./index-DalzLXVm.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./DialogTitle-DiqXRAVM.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./Backdrop-lmkQ576F.js";import"./Button-D9LFAX2g.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C-XbivhQ.js";import"./ErrorBoundary-CCN1fcMR.js";import"./ErrorPanel-BTFsykmd.js";import"./WarningPanel-DWxbAFrU.js";import"./ExpandMore-BotAWQ1n.js";import"./AccordionDetails-Dyf75Eaf.js";import"./index-DnL3XN75.js";import"./Collapse-BECsH0M_.js";import"./MarkdownContent-DTBwyM42.js";import"./CodeSnippet-BQDzaUOg.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./CopyTextButton-Y9iCOjyT.js";import"./useCopyToClipboard-DMYhOdjt.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./ListItem-DIBtNilh.js";import"./ListItemText-QaJAw11k.js";import"./LinkButton-CscTtu-Y.js";import"./Link-ClrQx1QP.js";import"./CardHeader-C2FhjhCg.js";import"./Divider-xOTMBAcj.js";import"./CardActions-DVY4viYA.js";import"./BottomLink-v4r4qDIO.js";import"./ArrowForward-DPFWrTp5.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
