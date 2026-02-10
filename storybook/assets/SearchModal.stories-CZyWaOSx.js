import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-BDvXWqMv.js";import{r as x}from"./plugin-C9fKKw56.js";import{S as l,u as c,a as S}from"./useSearchModal-D0Ik5qN5.js";import{s as M,M as C}from"./api-D4OhEijw.js";import{S as f}from"./SearchContext-C1PZ8VcQ.js";import{B as m}from"./Button-D_oOYcjF.js";import{D as j,a as y,b as B}from"./DialogTitle-DbfnWxYL.js";import{B as D}from"./Box-BU77o5ge.js";import{S as n}from"./Grid-SEE3Vji4.js";import{S as I}from"./SearchType-CWSbojHu.js";import{L as G}from"./List-BCScUoZK.js";import{H as R}from"./DefaultResultListItem-DeZjS59I.js";import{w as k}from"./appWrappers-D7GkfUM0.js";import{SearchBar as v}from"./SearchBar-6YEmyrYL.js";import{S as T}from"./SearchResult-B3wb_PfD.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DtnGOx-Y.js";import"./Plugin-6Gt6crr0.js";import"./componentData-8WYIPpYM.js";import"./useAnalytics-Bhj43Yb4.js";import"./useApp-XW1Y_59p.js";import"./useRouteRef-BNT0Uji7.js";import"./index-CuoyrUh2.js";import"./ArrowForward-B0ytsCDP.js";import"./translation-CkQUU2j5.js";import"./Page-M-J3ByLn.js";import"./useMediaQuery-BQ4ZmzNz.js";import"./Divider-BVTElTLB.js";import"./ArrowBackIos-B0EnwhnX.js";import"./ArrowForwardIos-RG8r1H8v.js";import"./translation-BolybVC0.js";import"./lodash-DTh7qDqK.js";import"./useAsync-CZTayVe5.js";import"./useMountedState-DRPCbnV1.js";import"./Modal-aUjOD6G2.js";import"./Portal-Bxsqc2Ff.js";import"./Backdrop-DQKzqBN9.js";import"./styled-Dje9scF9.js";import"./ExpandMore-D0gsRd1g.js";import"./AccordionDetails-Dl8lH0s0.js";import"./index-B9sM2jn7.js";import"./Collapse-CyX3uF1t.js";import"./ListItem-DtJ6NXng.js";import"./ListContext-BMD4k7rh.js";import"./ListItemIcon-CbobYgFd.js";import"./ListItemText-BChUSAmp.js";import"./Tabs-i8XbL7I6.js";import"./KeyboardArrowRight-CdEgdjjZ.js";import"./FormLabel-sGgvABuH.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-0HA80AJJ.js";import"./InputLabel-CyzBuKnt.js";import"./Select-BNHe7A3b.js";import"./Popover-D_XQo6qj.js";import"./MenuItem-CSXnJ9bo.js";import"./Checkbox-1Dh2QJWs.js";import"./SwitchBase-BBILVYl_.js";import"./Chip-BfcATEKy.js";import"./Link-OHorDb2O.js";import"./useObservable-C5WBInFh.js";import"./useIsomorphicLayoutEffect-Ckaa7XZb.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-CUDhOYN0.js";import"./useDebounce-DuXS03T0.js";import"./InputAdornment-BYAn4HXN.js";import"./TextField-DwKruZgA.js";import"./useElementFilter-DpMOsvx4.js";import"./EmptyState-CAclFvoF.js";import"./Progress-actpNxnk.js";import"./LinearProgress-xCnQNo7I.js";import"./ResponseErrorPanel-C342VFmX.js";import"./ErrorPanel-DIJrYilU.js";import"./WarningPanel-B6FaAcan.js";import"./MarkdownContent-CH9QtLal.js";import"./CodeSnippet-CRyXuPAV.js";import"./CopyTextButton-Bw_MRs6O.js";import"./useCopyToClipboard-CKArlyoH.js";import"./Tooltip-La5U8gro.js";import"./Popper-CBqxIWf4.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
