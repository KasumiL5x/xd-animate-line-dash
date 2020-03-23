const {Line, Path, Color} = require('scenegraph');
const commands = require('commands');

function createDialog() {
	document.body.innerHTML = `
		<style>
			#dialog form {
				width: 300px;
			}
		</style>
		<dialog id="dialog">
			<form method="dialog">
				<label>
					<span>strokeDashOffset value</span>
					<input uxp-quiet="true" type="text" id="offsetValue" value="0" />
				</label>
				<footer>
					<button id="cancel">Cancel</button>
					<button type="submit" id="set" uxp-variant="cta">Set</button>
				</footer>
			</form>
		</dialog>
	`;

	const dialog = document.querySelector('#dialog');
	const form = document.querySelector('#dialog form');
	const cancel = document.querySelector('#cancel')
	const set = document.querySelector('#set');
	const offsetValue = document.querySelector('#offsetValue');

	const submit = (e) => {
		dialog.close({offsetValue: parseFloat(offsetValue.value)});
	}

	cancel.addEventListener('click', () => {
		dialog.close();
	});
	set.addEventListener('click', e => {
		submit();
		e.preventDefault();
	});
	form.addEventListener('submit', e => {
		submit();
		e.preventDefault();
	});

	return dialog;
}

function getSelected(selection) {
	return selection.items.filter(el => el instanceof Path || el instanceof Line);
}

async function aldSetCommand(selection) {
	const dialog = createDialog();
	try {
		const result = await dialog.showModal();
		const offsetValue = result.offsetValue;

		if(isNaN(offsetValue)) {
			throw "offsetValue is not a number!";
		}

		console.log('Animate Line Dash');
		getSelected(selection).forEach(el => {
			console.log('\tSetting \`' + el.name + '\` phase to ' + offsetValue + '.');
			el.strokeDashOffset = offsetValue;
		});

	} catch (err) {
		console.log('Animate Line Dash Error: ' + err);
	}
}

function aldPrintCommand(selection) {
	console.log('Animate Line Dash');
	getSelected(selection).forEach(el => {
		console.log('\t\`' + el.name + '\`: ' + el.strokeDashOffset + '.');
	});
}

function animateLineDashPrint(selection) {
	let linesAndPaths = selection.items.filter(el => el instanceof Path || el instanceof Line);
	linesAndPaths.forEach(el => {
		console.log(el.name + ": " + el.strokeDashOffset);
	})
}

module.exports = {
	commands: {
		aldSetCommand,
		aldPrintCommand
	}
};