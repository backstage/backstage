import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C0ztlCqi.js";import{s as g,H as u}from"./plugin-Cbjrlx_7.js";import{c as h}from"./api-Bu9-z1sb.js";import{c as f}from"./catalogApiMock-3Q_s8rr2.js";import{s as x}from"./api-DOJHDmg8.js";import{S as y}from"./SearchContext-xqdO8Zdw.js";import{P as S}from"./Page-C4YZJdq_.js";import{S as r}from"./Grid-BJIH9AcQ.js";import{b as k,a as j,c as C}from"./plugin-D6qSC-Pj.js";import{T as P}from"./TemplateBackstageLogo-DQ0M-3LP.js";import{T}from"./TemplateBackstageLogoIcon-q_5ih5Pb.js";import{e as I}from"./routes-Fbf12er2.js";import{w as v}from"./appWrappers-SwbnenOq.js";import{s as G}from"./StarredEntitiesApi-DYtY_RyH.js";import{M as A}from"./MockStarredEntitiesApi-BxFKf-1G.js";import{I as B}from"./InfoCard-B_00yS8h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D52-Mxqs.js";import"./Plugin-C7koouQA.js";import"./componentData-CW45w-aT.js";import"./useAnalytics-BXjJbJ2d.js";import"./useApp-WkaDZJI-.js";import"./useRouteRef-B0OGFprJ.js";import"./index-BSDdaq1o.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BkXPEwdl.js";import"./useMountedState-CWuBAMfh.js";import"./DialogTitle-BqVBbkwh.js";import"./Modal-iwdO8Psb.js";import"./Portal-DgY2uLlM.js";import"./Backdrop-B-rl279U.js";import"./Button-CoF0Xodx.js";import"./useObservable-bc9p5D-G.js";import"./useIsomorphicLayoutEffect-HC7ppjUM.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BIqibGTm.js";import"./ErrorBoundary-B8VGBRFr.js";import"./ErrorPanel-BYV5vIqY.js";import"./WarningPanel-DIeTt0sm.js";import"./ExpandMore-DjatSCT2.js";import"./AccordionDetails-Qdo8hGCI.js";import"./index-B9sM2jn7.js";import"./Collapse-BOuwDmTN.js";import"./MarkdownContent-B6mn0xbm.js";import"./CodeSnippet-B5tPiRbT.js";import"./Box-CzQDPnzy.js";import"./styled-CWdZ-Z1U.js";import"./CopyTextButton-CR_eNMPC.js";import"./useCopyToClipboard-Cj1xpuKu.js";import"./Tooltip-BUzhfLp0.js";import"./Popper-BpDPZdlA.js";import"./List-dufFXco6.js";import"./ListContext-CkQIvbtj.js";import"./ListItem-BjSKqJNR.js";import"./ListItemText-C6kGUtI_.js";import"./LinkButton-Ce6yUEJH.js";import"./Link-BUMam9f4.js";import"./CardHeader-ComZ7hKq.js";import"./Divider-CQWOB-Qy.js";import"./CardActions-CviPlupu.js";import"./BottomLink-C1LO4qL8.js";import"./ArrowForward-CZyq4r4K.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
