import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BY6cr4Gs.js";import{s as g,H as u}from"./plugin-DfBn9OsQ.js";import{c as h}from"./api-BkBhYlPQ.js";import{c as f}from"./catalogApiMock-C6IxRpD4.js";import{s as x}from"./api-Bn_bwlkS.js";import{S as y}from"./SearchContext-Dt9zyNyK.js";import{P as S}from"./Page-OyjVOVUB.js";import{S as r}from"./Grid-CPNST6ei.js";import{b as k,a as j,c as C}from"./plugin-D9w6b_6Z.js";import{T as P}from"./TemplateBackstageLogo-BNKuFD4V.js";import{T}from"./TemplateBackstageLogoIcon-wbI0na4d.js";import{e as I}from"./routes-CcFiWGl-.js";import{w as v}from"./appWrappers-Pq-5KpLz.js";import{s as G}from"./StarredEntitiesApi-DN2hreE0.js";import{M as A}from"./MockStarredEntitiesApi-CwVrJCFg.js";import{I as B}from"./InfoCard-BuJiqpT7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B19kwgjz.js";import"./Plugin-1eY0U0Da.js";import"./componentData-DkH1zoGD.js";import"./useAnalytics-BgncGw0N.js";import"./useApp-Tcb-kbrm.js";import"./useRouteRef-CBJLvC2e.js";import"./index-CidjncPb.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./DialogTitle-CbbvyQ_k.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./Backdrop-BfxA9Fnq.js";import"./Button-BcV-aad6.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-JC9uGNq1.js";import"./ErrorBoundary-hvzZq_Hc.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./ExpandMore-3nEtbL-z.js";import"./AccordionDetails-B6u38Rkn.js";import"./index-B9sM2jn7.js";import"./Collapse-hpYL9C9B.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./CopyTextButton-CGe-CNwz.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./ListItem-Bc4c47Te.js";import"./ListItemText-DmFJDJ0x.js";import"./LinkButton-ByF38BEu.js";import"./Link-Y-vtcYZ5.js";import"./CardHeader-C1KSGg0j.js";import"./Divider-0kZVZRxa.js";import"./CardActions-wlHMcfv2.js";import"./BottomLink-4rbJl6ej.js";import"./ArrowForward-C-vHhjk_.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
