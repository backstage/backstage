import{j as t,W as u,K as p,X as g}from"./iframe-CmjKepAK.js";import{r as h}from"./plugin-oYSOx7RQ.js";import{S as l,u as c,a as x}from"./useSearchModal-Cfz6pqbr.js";import{s as S,M}from"./api-CMMmHn_k.js";import{S as C}from"./SearchContext-CvMYsf4i.js";import{B as m}from"./Button-0Iky-ZUc.js";import{m as f}from"./makeStyles-rFkGMQln.js";import{D as j,a as y,b as B}from"./DialogTitle-BOmlPBeH.js";import{B as D}from"./Box-C55POBiq.js";import{S as n}from"./Grid-BnHJoKKz.js";import{S as I}from"./SearchType-CJ9FzKe-.js";import{L as G}from"./List-IEhbKV8f.js";import{H as R}from"./DefaultResultListItem-BnyxMWjf.js";import{w as k}from"./appWrappers-EyfP4mPN.js";import{SearchBar as v}from"./SearchBar-C0mRwk3a.js";import{S as T}from"./SearchResult-CVad4S5G.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D6Ky6vlB.js";import"./Plugin-DX1ESXRt.js";import"./componentData-BYKFZO45.js";import"./useAnalytics-C2hMq441.js";import"./useApp-CYm6BWpS.js";import"./useRouteRef-DBy6MDwa.js";import"./index-B0ldSqfO.js";import"./ArrowForward-DMeOXqNP.js";import"./translation--vEZqHJ2.js";import"./Page-Bii0LALH.js";import"./useMediaQuery-CGdIteyf.js";import"./Divider-DQqwXrEG.js";import"./ArrowBackIos-JaKJV1es.js";import"./ArrowForwardIos-D5Ok28dX.js";import"./translation-Du9yetw1.js";import"./lodash-DX7XxPLm.js";import"./useAsync-DhoQsFBa.js";import"./useMountedState-CjGZo6tl.js";import"./Modal-BI6ifavC.js";import"./Portal-BqvT6j51.js";import"./Backdrop-Ddfitpfc.js";import"./styled-DL3tZMBP.js";import"./ExpandMore-DpE81Iih.js";import"./AccordionDetails-DeGigw1-.js";import"./index-B9sM2jn7.js";import"./Collapse-Dm6Hazgb.js";import"./ListItem-Bnkh6FOH.js";import"./ListContext-2rvRcxSY.js";import"./ListItemIcon-DVcQYyBj.js";import"./ListItemText-CNtEcy1B.js";import"./Tabs-CNCA2wlz.js";import"./KeyboardArrowRight-CDWouPwq.js";import"./FormLabel-jAM09VPt.js";import"./formControlState--KFx6Tmi.js";import"./InputLabel-Dhw4JOfD.js";import"./Select-ByJeIivF.js";import"./Popover-BuXPx6d1.js";import"./MenuItem-Crk74T1c.js";import"./Checkbox-smpgeUXu.js";import"./SwitchBase-UxNZgzv7.js";import"./Chip-DTm-Gxx3.js";import"./Link-BGP-9ag5.js";import"./index-eKWyzuf6.js";import"./useObservable-DeSzxYtu.js";import"./useIsomorphicLayoutEffect-Dp3BdtFL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CS5yjIoC.js";import"./useDebounce-BDQPmvJV.js";import"./InputAdornment-n0U2nEKR.js";import"./TextField-CXZO0L0Q.js";import"./useElementFilter-D-MjwVJb.js";import"./EmptyState-CEBofuf7.js";import"./Progress-tKLjrM1Y.js";import"./LinearProgress-DQdmzUTT.js";import"./ResponseErrorPanel-8zg_0Y5-.js";import"./ErrorPanel-DszDZl6s.js";import"./WarningPanel-Bzp2Jc9K.js";import"./MarkdownContent-BMHQGjp4.js";import"./CodeSnippet-o7rWkpzX.js";import"./CopyTextButton-Cyk9raB0.js";import"./useCopyToClipboard-DQ8eQiBS.js";import"./Tooltip-DYOv2ULC.js";import"./Popper-CMPq-ztF.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
