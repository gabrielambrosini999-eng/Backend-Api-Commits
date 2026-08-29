const { Commit } = require('../models');

class ApiCommitController {
    static async index(req, res, next) {
        try {
            const repositoryId = Number(req.params.repositoryId);

            const commits = await Commit.findAll({
                where: { repository_id: repositoryId },
                order: [['created_at', 'DESC']],
            });

            return res.json(commits);
        } catch (error) {
            return next(error);
        }
    }

    static async show(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ error: 'Commit no encontrado' });
            }

            const commit = await Commit.findByPk(id);

            if (!commit) {
                return res.status(404).json({ error: 'Commit no encontrado' });
            }

            return res.json(commit);
        } catch (error) {
            return next(error);
        }
    }

    static async store(req, res, next) {
        try {
            const repositoryId = Number(req.params.repositoryId);

            const commit = await Commit.create({
                message: req.body.message.trim(),
                repository_id: repositoryId,
                branch_id: req.body.branch_id !== undefined && req.body.branch_id !== null
                    ? Number(req.body.branch_id)
                    : null,
                    user_id: req.body.user_id !== undefined && req.body.user_id !== null
                    ? Number(req.body.user_id)
                    : null,
            });
            return res.status(201).json(commit);
        } catch (error) {
            return next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(404).json({ error: 'Commit no encontrado' });
            }

            const commit = await Commit.findByPk(id);

            if (!commit) {
                return res.status(404).json({ error: 'Commit no encontrado' });
            }

            const updates = {
                message: req.body.message.trim(),
            };

            if (req.body.repository_id !== undefined) { 
                updates.repository_id = Number(req.body.repository_id);
            }

            if (req.body.branch_id !== undefined) {
                updates.branch_id = req.body.branch_id == null ? null : Number(req.body.branch_id);
            }

            if (req.body.user_id !== undefined) {
                updates.user_id = req.body.user_id == null ? null : Number(req.body.user_id);
            }

            await commit.update(updates);

            return res.json(commit);
        } catch (error) {
            return next(error);
        }
    }

    static async destroy(req, res, next) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(404).json({ error: 'Commit no encontrado' });
            }

            const commit = await Commit.findByPk(id);

            if (!commit) {
                return res.status(404).json({ error: 'Commit no encontrado' });
            }

            await commit.destroy();

            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = ApiCommitController;