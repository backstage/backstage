import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-CMoZkI_V.js";import{s as g,H as u}from"./plugin-CrYADn4T.js";import{c as h}from"./api-BErYSGYP.js";import{c as f}from"./catalogApiMock-Dg21zjsY.js";import{s as x}from"./api-BfofgL2m.js";import{S as y}from"./SearchContext-D7PPC6FZ.js";import{P as S}from"./Page-qdmVxXkj.js";import{S as r}from"./Grid-Cc5u-Kft.js";import{b as k,a as j,c as C}from"./plugin-Bm43qfKP.js";import{T as P}from"./TemplateBackstageLogo-D-moLroE.js";import{T}from"./TemplateBackstageLogoIcon-BawNpM9X.js";import{e as I}from"./routes-DSa0lLCp.js";import{w as v}from"./appWrappers-CwLdvgVt.js";import{s as G}from"./StarredEntitiesApi-CQ4NzV4m.js";import{M as A}from"./MockStarredEntitiesApi-CApd12C0.js";import{I as B}from"./InfoCard-B7VpOy60.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DEPSeTYd.js";import"./Plugin-Cw-agZnT.js";import"./componentData-C1GpKGWH.js";import"./useAnalytics-aVKC-y-x.js";import"./useApp-Cq0FwDqI.js";import"./useRouteRef-BKopQGJE.js";import"./index-Dl6v8jff.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-nuZztPgy.js";import"./useMountedState-DXAXWcHb.js";import"./DialogTitle-D9NQ_O8G.js";import"./Modal-JpNI_f-q.js";import"./Portal-BsEe4NVr.js";import"./Backdrop-t6uNU6s-.js";import"./Button-CMlJ_q4q.js";import"./useObservable-f8TZQGuk.js";import"./useIsomorphicLayoutEffect-DTydLypZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DxGlUsBp.js";import"./ErrorBoundary-p7Vx4hun.js";import"./ErrorPanel-4fnCiNRY.js";import"./WarningPanel-CrW_vej9.js";import"./ExpandMore-RbVyUBOe.js";import"./AccordionDetails-BpZtQ7qf.js";import"./index-B9sM2jn7.js";import"./Collapse-CttgXTbY.js";import"./MarkdownContent-BAnHPybQ.js";import"./CodeSnippet-CC5elSQb.js";import"./Box-DDWlRNcc.js";import"./styled-BPnpuM9w.js";import"./CopyTextButton-D_szYgc0.js";import"./useCopyToClipboard-LW0UmRxQ.js";import"./Tooltip-DqsRLJKa.js";import"./Popper-p2DZK6W8.js";import"./List-mLBkoS87.js";import"./ListContext-DCW7FG4X.js";import"./ListItem-DQ5raIpn.js";import"./ListItemText-CMPMNvTt.js";import"./LinkButton-Br-4b2Az.js";import"./Link-_YMea8vG.js";import"./CardHeader-CDcSzNkn.js";import"./Divider-DAPmlDv6.js";import"./CardActions-DJqB9_Ii.js";import"./BottomLink-Cy-SqU1H.js";import"./ArrowForward-CYQeWInn.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
