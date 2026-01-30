import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-ByNNXeiS.js";import{r as x}from"./plugin-CDyCybnV.js";import{S as l,u as c,a as S}from"./useSearchModal-CvR9g8Fz.js";import{s as M,M as C}from"./api-DA-fIJu2.js";import{S as f}from"./SearchContext-DesFCcHK.js";import{B as m}from"./Button-DOFZXYjQ.js";import{D as j,a as y,b as B}from"./DialogTitle-YYVkYrji.js";import{B as D}from"./Box-bD4mu6aM.js";import{S as n}from"./Grid-COH9vICu.js";import{S as I}from"./SearchType-BylIwPAm.js";import{L as G}from"./List-Dw_wv5bM.js";import{H as R}from"./DefaultResultListItem-Dq9Qk_X-.js";import{w as k}from"./appWrappers-DatLzHRZ.js";import{SearchBar as v}from"./SearchBar-DvheGF_o.js";import{S as T}from"./SearchResult-BbNJMJhx.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BjK08xqG.js";import"./Plugin-pqbE9k03.js";import"./componentData-CBWBgxbI.js";import"./useAnalytics-BatNLUt2.js";import"./useApp-BIEPQg0g.js";import"./useRouteRef-BhZuTamD.js";import"./index-BTmRWwN6.js";import"./ArrowForward-CwrmR3h3.js";import"./translation-CbRq6qwg.js";import"./Page-9z0f7Kvu.js";import"./useMediaQuery-CvjcEiIW.js";import"./Divider-DmVn_tUx.js";import"./ArrowBackIos-C2X7xkmQ.js";import"./ArrowForwardIos-2bQumote.js";import"./translation-BpYS1BTa.js";import"./lodash-Czox7iJy.js";import"./useAsync-CQMi4841.js";import"./useMountedState-BOphWm7n.js";import"./Modal-Sjev8ZKO.js";import"./Portal-0sot7Ylp.js";import"./Backdrop-CnaZtlJi.js";import"./styled-CuXflSyU.js";import"./ExpandMore-BLvu8MU4.js";import"./AccordionDetails-C7U2wsbT.js";import"./index-B9sM2jn7.js";import"./Collapse-BjluhvND.js";import"./ListItem-CKlTPKne.js";import"./ListContext-CXkvT0sH.js";import"./ListItemIcon-BK7G5ODz.js";import"./ListItemText-DCU7V9rR.js";import"./Tabs-BPRX_qX7.js";import"./KeyboardArrowRight-BymeA56_.js";import"./FormLabel-o-yOosKQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-aEBpjwx_.js";import"./InputLabel-UmButm-f.js";import"./Select-BRBj_LRu.js";import"./Popover-DtfOeBBz.js";import"./MenuItem-DF4BigO-.js";import"./Checkbox-DLuuPMWR.js";import"./SwitchBase-DXbvjmul.js";import"./Chip-DhLNBuI8.js";import"./Link-B8WLAU68.js";import"./useObservable-GGfqox2V.js";import"./useIsomorphicLayoutEffect-BQxAPDGa.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BqwIRtsp.js";import"./useDebounce-CfjLBtz7.js";import"./InputAdornment-CQqQOhg8.js";import"./TextField-CzIMbtwl.js";import"./useElementFilter-D3RqbpYt.js";import"./EmptyState-BBcTOtdG.js";import"./Progress-DaZZnLIr.js";import"./LinearProgress-C2yTuN0s.js";import"./ResponseErrorPanel-D5QWTxBo.js";import"./ErrorPanel-CTICeqhn.js";import"./WarningPanel-fBpuhxcO.js";import"./MarkdownContent-Czdavqjx.js";import"./CodeSnippet-DyKHxpoR.js";import"./CopyTextButton-DCj9B9eD.js";import"./useCopyToClipboard-k9NuIUEn.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
