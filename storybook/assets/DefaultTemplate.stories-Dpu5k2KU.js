import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DpqnIERb.js";import{s as g,H as u}from"./plugin-XTH6pJl9.js";import{c as h}from"./api-Ca_UAIs9.js";import{c as f}from"./catalogApiMock-CN0wlUFR.js";import{s as x}from"./api-lgE5jH2i.js";import{S as y}from"./SearchContext-CPmiQTPj.js";import{P as S}from"./Page-BMUZJV4W.js";import{S as r}from"./Grid-ByES49Fm.js";import{b as k,a as j,c as C}from"./plugin-Cx3M3zXy.js";import{T as P}from"./TemplateBackstageLogo-BxY4hn1g.js";import{T}from"./TemplateBackstageLogoIcon-DsDF5jOa.js";import{e as I}from"./routes-Ik6lsek0.js";import{w as v}from"./appWrappers-DtX5QIpn.js";import{s as G}from"./StarredEntitiesApi-XMwuvPjE.js";import{M as A}from"./MockStarredEntitiesApi-D5XV2u8t.js";import{I as B}from"./InfoCard-DIeyI-8u.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzHsSl9-.js";import"./Plugin-BwzRXZkr.js";import"./componentData-Bjp7AxYA.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./useRouteRef-Do6k1rAi.js";import"./index-DoyRYStT.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./useAsync-DJIduLQY.js";import"./useMountedState-5johZ_Rp.js";import"./DialogTitle--5D8qIle.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./Backdrop-BRjIVZ8-.js";import"./Button-CVkCSpbG.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B6Jpg0qe.js";import"./ErrorBoundary-Dt-Pq3d7.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./ExpandMore-BgvB3-yb.js";import"./AccordionDetails-Bu4VHsDj.js";import"./index-B9sM2jn7.js";import"./Collapse-BXZ4KKDG.js";import"./MarkdownContent-C_B0rjEe.js";import"./CodeSnippet-BZN7CHRt.js";import"./Box-B2dMzSz4.js";import"./styled-iMmr_MI_.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";import"./List-CZbmWexd.js";import"./ListContext-BxawfRoI.js";import"./ListItem-D0Z8ElGo.js";import"./ListItemText-DoVLQ6VK.js";import"./LinkButton-ImbjNSpo.js";import"./Link-CYlpUQKG.js";import"./CardHeader-BeO5U3X8.js";import"./Divider-BjLL1Xub.js";import"./CardActions-B9E1ejZA.js";import"./BottomLink-InnL8-4N.js";import"./ArrowForward-BUxo812p.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
