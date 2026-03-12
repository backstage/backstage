import{j as t,W as u,K as p,X as g}from"./iframe-CmF8XmXW.js";import{r as h}from"./plugin-COVZ5zh3.js";import{S as l,u as c,a as x}from"./useSearchModal-BmzgEqvm.js";import{s as S,M}from"./api-aBcga9Tq.js";import{S as C}from"./SearchContext-DL68mesI.js";import{B as m}from"./Button-CAnlWrjv.js";import{m as f}from"./makeStyles-Ibhc4-lx.js";import{D as j,a as y,b as B}from"./DialogTitle-CktiK1Gr.js";import{B as D}from"./Box-D2-qDd5p.js";import{S as n}from"./Grid-DKauYoce.js";import{S as I}from"./SearchType-C_MGZaP3.js";import{L as G}from"./List-D_AhGxTu.js";import{H as R}from"./DefaultResultListItem-DCxFIlWG.js";import{w as k}from"./appWrappers-CUWm5cOJ.js";import{SearchBar as v}from"./SearchBar-BVJW4PGr.js";import{S as T}from"./SearchResult-DAq6TTf3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CV4-iXJv.js";import"./Plugin-DHuHqt8T.js";import"./componentData-6buD7kJq.js";import"./useAnalytics-BnM0MC_9.js";import"./useApp-DpGn1tXX.js";import"./useRouteRef-BinR2jqN.js";import"./index-llNJvO4J.js";import"./ArrowForward-CegHiBQx.js";import"./translation-D6XRjhx2.js";import"./Page-71tGcaNF.js";import"./useMediaQuery-DshIhQbB.js";import"./Divider-BTYI3J8W.js";import"./ArrowBackIos-D5z9VYJg.js";import"./ArrowForwardIos-au1e1qBY.js";import"./translation-27upvxjK.js";import"./lodash-BMfEwEVA.js";import"./useAsync-BlS6PWf7.js";import"./useMountedState-R5vPNZNY.js";import"./Modal-DKAQifd-.js";import"./Portal-DLYTgwQk.js";import"./Backdrop-kxYB05qc.js";import"./styled-Cq2u0_JF.js";import"./ExpandMore-BnNCizO_.js";import"./AccordionDetails-BYaC3E9d.js";import"./index-B9sM2jn7.js";import"./Collapse-BS0HCykQ.js";import"./ListItem-BaOpUjbT.js";import"./ListContext-CMFfQs0i.js";import"./ListItemIcon-B6wmESKr.js";import"./ListItemText-CrhfGm7Z.js";import"./Tabs-DKVRxoMc.js";import"./KeyboardArrowRight-CLsWRAUN.js";import"./FormLabel-CsUHcHeY.js";import"./formControlState-M8LFgNtt.js";import"./InputLabel-BUg-8uEv.js";import"./Select-BCMka2Zl.js";import"./Popover-D8ZxMx0p.js";import"./MenuItem-CrFO4BH1.js";import"./Checkbox-bGRTIDmC.js";import"./SwitchBase-kq7OKybc.js";import"./Chip-BJtOmw-4.js";import"./Link-DQbBb7hJ.js";import"./index-BiWnJDna.js";import"./useObservable-DAhkL3FZ.js";import"./useIsomorphicLayoutEffect-BvOu1nZP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BorbYsTT.js";import"./useDebounce-LxjuuCSP.js";import"./InputAdornment-V1Te3gi0.js";import"./TextField-D4uWFQjo.js";import"./useElementFilter-BPL5JS7b.js";import"./EmptyState-CiP9eqQw.js";import"./Progress-Decct4yq.js";import"./LinearProgress-DVLoqgKT.js";import"./ResponseErrorPanel-Bw7C81dv.js";import"./ErrorPanel-DwPayJ2R.js";import"./WarningPanel-_AyfI691.js";import"./MarkdownContent-B0jZk0lY.js";import"./CodeSnippet-Bxnp2WGp.js";import"./CopyTextButton-xmjJbH78.js";import"./useCopyToClipboard-BzKQk1qC.js";import"./Tooltip-DhgmU7T0.js";import"./Popper-CVpB9i3l.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
