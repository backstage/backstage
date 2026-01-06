import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DgkzaRcz.js";import{s as g,H as u}from"./plugin-Cl9I96LN.js";import{c as h}from"./api-BqwTHubc.js";import{c as f}from"./catalogApiMock-C_YXjN6t.js";import{s as x}from"./api-BJ3-p9vs.js";import{S as y}from"./SearchContext-DGF8OHr8.js";import{P as S}from"./Page-SRyZB_Hv.js";import{S as r}from"./Grid-13HvIHxd.js";import{b as k,a as j,c as C}from"./plugin-KjjyD6lr.js";import{T as P}from"./TemplateBackstageLogo-BtVufr8s.js";import{T}from"./TemplateBackstageLogoIcon-Cxo_63bA.js";import{e as I}from"./routes-Cb5xYd94.js";import{w as v}from"./appWrappers-BBkmPso_.js";import{s as G}from"./StarredEntitiesApi-B83Gzzxz.js";import{M as A}from"./MockStarredEntitiesApi-BSexnR-B.js";import{I as B}from"./InfoCard-DroCXsE2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BH7N7lqx.js";import"./Plugin-Dd63G45J.js";import"./componentData-D6jwBdZo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./useRouteRef-CgaN9BS2.js";import"./index-BovWTFKo.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-B6sI7pgh.js";import"./useMountedState-C4ChfPSk.js";import"./DialogTitle-CLNs8i90.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./Backdrop-Do9s46dm.js";import"./Button-DputNV-f.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BEcXzYfT.js";import"./ErrorBoundary-BMyytlZG.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./index-B9sM2jn7.js";import"./Collapse-zjOOSLQm.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./ListItem-D-dCGJEh.js";import"./ListItemText-BTjp8q3D.js";import"./LinkButton-Cj7uwqzc.js";import"./Link-CD76Rbm5.js";import"./CardHeader-BIR3esA0.js";import"./Divider-BsgTAdRC.js";import"./CardActions-VTkMzbqT.js";import"./BottomLink-DudYzn0u.js";import"./ArrowForward-Df-EQyM5.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
