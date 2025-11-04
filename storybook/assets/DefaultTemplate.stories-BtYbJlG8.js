import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BFEEYdl1.js";import{s as g,H as u}from"./plugin-COvH9GCz.js";import{c as h}from"./api-BXvcrOVy.js";import{c as f}from"./catalogApiMock-CNKIenRE.js";import{s as x}from"./api-DIzRtX_C.js";import{S as y}from"./SearchContext-DfMXAnHC.js";import{P as S}from"./Page-0VZY3eQt.js";import{S as r}from"./Grid-_pxMEZfk.js";import{b as k,a as j,c as C}from"./plugin-DKiRlTDL.js";import{T as P}from"./TemplateBackstageLogo-1GZI11PR.js";import{T}from"./TemplateBackstageLogoIcon-0rnfpHX6.js";import{e as I}from"./routes-Hzt0uvEG.js";import{w as v}from"./appWrappers-Drr8kDaZ.js";import{s as G}from"./StarredEntitiesApi-DOAUIFbX.js";import{M as A}from"./MockStarredEntitiesApi-7LA6DjNd.js";import{I as B}from"./InfoCard-BJpJ1bY7.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DwWrsyLS.js";import"./Plugin-EFweYiy3.js";import"./componentData-fXGhNbVj.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./useRouteRef-Djz7qv6Y.js";import"./index-DFzOTOJF.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-CK6ps4Gs.js";import"./useMountedState-SzYJvnyY.js";import"./DialogTitle-C53FTZ8W.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./Backdrop-Cc0uQTMy.js";import"./Button-Ci5q7ey2.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C0IdQT8E.js";import"./ErrorBoundary-BrFvpfH8.js";import"./ErrorPanel-ByBjA_Oh.js";import"./WarningPanel-Ca_owezB.js";import"./ExpandMore-Ctn3qfGH.js";import"./AccordionDetails-BWiYd2nY.js";import"./index-DnL3XN75.js";import"./Collapse-DQjjdB13.js";import"./MarkdownContent-BVMx6-i7.js";import"./CodeSnippet-DKeVSYKZ.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./CopyTextButton-CPUbqQk2.js";import"./useCopyToClipboard-CNm0_dns.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./ListItem-CoJRgtBh.js";import"./ListItemText-B34yPKAV.js";import"./LinkButton-CtAJOX-o.js";import"./Link-BzkurKFl.js";import"./CardHeader-aKIXN66o.js";import"./Divider-CYSzQ_1E.js";import"./CardActions-BCgG5ICW.js";import"./BottomLink-Z_9FJnlR.js";import"./ArrowForward-CQW_bFSW.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
